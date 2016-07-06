var helper = require('helper');

module.exports = {

	run: function(creep) {

		if(Game.flags.attack) {
			Memory.neededAttackers = 4;
			Memory.neededHealers = 4;


			let amountOfAttackers = _.sum(Game.creeps, (c) => c.memory.role == 'attacker');
			let amountOfHealers = _.sum(Game.creeps, (c) => c.memory.role == 'healer');

			if(amountOfAttackers + amountOfHealers === Memory.neededAttackers + Memory.neededHealers) {
				//this will currently make the creep go back, get healed for a seconds and then return, make it so the creep gets fully healed before returning
				if(creep.hits > creep.hitsMax/2) {
					if(creep.room.name != Game.flags.attack.room.name) {
						creep.moveTo(Game.flags.attack);
					}
					else {
						if(helper.getOffExits(creep)) {return;}
					}
				}
				else {
					if(creep.room.name == Game.flags.attack.room.name) {
						helper.moveToRoom(creep, Game.spawns[0].room.name);
					}
					else if(creep.room.name == Game.spawns[0].room.name) {
						if(helper.getOffExits(creep)) {return;}

					}
				}
			}

		}
		else {
			Memory.neededAttackers = 0;
			Memory.neededHealers = 0;
		}
		
	}

};
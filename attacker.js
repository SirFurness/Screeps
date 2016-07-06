var helper = require('helper');

module.exports = {

	run: function(creep) {

		if(Game.flags.attack) {
			Memory.neededAttackers = 4;
			Memory.neededHealers = 4;


			if(creep.memory.attacking && creep.hits < creep.hitsMax/2) {
				creep.memory.attacking = false;
			}
			else if(!creep.memory.attacking && creep.hits == creep.hitsMax) {
				creep.memory.attacking = true;
			}

			let amountOfAttackers = _.sum(Game.creeps, (c) => c.memory.role == 'attacker');
			let amountOfHealers = _.sum(Game.creeps, (c) => c.memory.role == 'healer');

			if(amountOfAttackers + amountOfHealers === Memory.neededAttackers + Memory.neededHealers) {

				if(creep.memory.attacking) {
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
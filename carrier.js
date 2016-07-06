var helper = require('helper');

module.exports = {
    //carrying
    carry: function(creep) {
        //console.log(creep.name);

        if(creep.memory.carrying && creep.carry.energy == 0) {
            creep.memory.carrying = false;
        }
        else if(!creep.memory.carrying && creep.carry.energy == creep.carryCapacity) {
            creep.memory.carrying = true;
        }

        if(!creep.memory.carrying) {
            helper.claimDroppedEnergy(creep);
            helper.pickUpEnergy(creep);
        }
        else if(creep.memory.carrying){
            helper.takeEnergyBack(creep);
            let amountOfRole = _.sum(Game.creeps, (c) => c.memory.role == 'carrier');
            if(amountOfRole == 1) {
                creep.memory.source = 0;
            }
        }
    }
};
var helper = require('helper');

module.exports = {
    run: function(creep) {
        if(creep.memory.transfering && creep.carry.energy <= 0) {
            creep.memory.transfering = false;
        }
        else if(!creep.memory.transfering && creep.carry.energy >= creep.carryCapacity) {
            creep.memory.transfering = true;
        }

        if(creep.memory.transfering) {
            helper.giveTowersEnergy(creep);
        }
        else {
            helper.getEnergy(creep);
        }
    }
};
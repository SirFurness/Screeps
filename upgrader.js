var helper = require('helper');
var harvester = require('harvester');

module.exports = {
    //upgrading
    upgrade: function(creep) {

        Memory.neededUpgraders = 2;

        if(Memory.harvesterEmergency = true) {
            harvester.firstHarvester(creep);
        }
        else {
            if (creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
            }
            else if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
                creep.memory.upgrading = true;
            }

            if (!creep.memory.upgrading) {
                helper.getEnergy(creep);
            }
            else {
                helper.upgradeController(creep);
            }
        }
    }
};
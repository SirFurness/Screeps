var helper = require('helper');
var upgrader = require('upgrader');

module.exports = {
    run: function(creep) {
        Memory.neededRepairers = 2;

        if(creep.memory.repairing && creep.carry.energy <= 0) {
            creep.memory.repairing = false;
        }
        else if(!creep.memory.repairing && creep.carry.energy >= creep.carryCapacity) {
            creep.memory.repairing = true;
        }

        if(creep.memory.repairing == true) {
            if(Memory.hostiles == true) {
                
            }
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_RAMPART ||
                            structure.structureType === STRUCTURE_WALL ||
                            structure.structureType === STRUCTURE_ROAD ||
                            structure.structureType === STRUCTURE_EXTENSION) && (structure.hits < structure.hitsMax)
                    }
                });
                if (targets.length > 0) {
                    let target = _.min(targets, function (o) {
                        return o.hits;
                    });
                    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else {
                    helper.giveTowersEnergy(creep);

                }
            }

        }
        else  {
            helper.getEnergy(creep);
        }

    }
};
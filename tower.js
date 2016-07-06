var helper = require('helper');

module.exports = {
    run: function(tower) {
        if(tower.energy > 0) {
            let allHostiles = tower.room.find(FIND_HOSTILE_CREEPS);
            if (allHostiles.length > 0) {
                let hostiles;
                hostiles = _.filter(allHostiles, function (o) {
                    return (o.getActiveBodyparts(HEAL) != 0);
                });
                if(hostiles.length == 0) {
                    hostiles = _.filter(allHostiles, function (o) {
                        return o.getActiveBodyparts(ATTACK) != 0 || o.getActiveBodyparts(RANGED_ATTACK) != 0;
                    });
                }
                if (hostiles.length > 0) {
                    tower.attack(hostiles[0]);
                }
                else {
                    tower.attack(allHostiles[0]);
                }
            }
            else {

                let creepsNeedingHeal = tower.room.find(FIND_MY_CREEPS,
                    {
                        filter: (creep) => {
                            return (creep.hits < creep.hitsMax)
                        }
                    });
                if (creepsNeedingHeal.length > 0) {
                    let creepNeedingHeal = _.min(creepsNeedingHeal, function (o) {
                        return o.hits;
                    });

                    tower.heal(creepNeedingHeal);
                }
                else {
                    let structuresNeedingRepair = tower.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType === STRUCTURE_SPAWN ||
                                structure.structureType === STRUCTURE_RAMPART ||
                                structure.structureType === STRUCTURE_WALL ||
                                structure.structureType === STRUCTURE_ROAD ||
                                structure.structureType === STRUCTURE_EXTENSION) && (structure.hits <= 301) && (structure.hits < structure.hitsMax)
                        }
                    });
                    if (structuresNeedingRepair.length > 0) {
                        let structure = _.min(structuresNeedingRepair, function (o) {
                            return o.hits;
                        });

                        tower.repair(structure);
                    }
                    else if(tower.energy >= tower.energyCapacity * 0.75) {
                        let structuresNeedingRepair = tower.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType === STRUCTURE_RAMPART ||
                                    structure.structureType === STRUCTURE_WALL) && (structure.hits < structure.hitsMax);
                            }
                        });
                        if (structuresNeedingRepair.length > 0 && tower.energy >= (tower.energyCapacity * 0.75)) {
                            let structure = _.min(structuresNeedingRepair, function (o) {
                                return o.hits;
                            });

                            tower.repair(structure);
                        }
                    }
                }
            }

        }
    }
};
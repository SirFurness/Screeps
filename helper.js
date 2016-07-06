module.exports = {
    findUnclaimedSources: function(creep) {
        var sources = creep.room.find(FIND_SOURCES_ACTIVE);

        var typeWithAssignedSources = _.filter(Game.creeps, c => c.memory.role === creep.memory.role && c.memory.source);

        var unclaimedSources = sources;
        if(typeWithAssignedSources.length > 0) {
            _.forEach(typeWithAssignedSources, function(c) {
                let typeSource = Game.getObjectById(c.memory.source);
                _.pull(unclaimedSources, typeSource);
            })
        }
        return unclaimedSources;
    },

    claimSource: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        Memory.neededHarvesters = sources.length;
        if(creep.memory.source) return;

        let closestSource = creep.pos.findClosestByRange(this.findUnclaimedSources(creep));
        if(!closestSource) {
            return;
        }
        creep.memory.source = closestSource.id;


    },

    harvestSource: function(creep) {
        let source = Game.getObjectById(creep.memory.source);
        if(!source) {
            return;
        }

        if(!creep.pos.isNearTo(source)) {
            creep.moveTo(source);
        }
        else {
            creep.harvest(source);
        }
    },

    takeEnergyBack: function(creep) {
            let targets = Game.spawns[0].room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) &&
                structure.energy < structure.energyCapacity;
        }
        });

        let target = targets[0];

        if(creep.room == Game.spawns[0].room) {
            target = creep.pos.findClosestByRange(targets)
        }

        if(target) {
            if(creep.pos.isNearTo(target)) {
                creep.transfer(target, RESOURCE_ENERGY)
            }
            else {
                creep.moveTo(target, {reusePath: 50});
            }
        }
        else {
            let newTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) &&
                        structure.energy < structure.energyCapacity;
                }});
            if(newTargets.length > 0) {
                if(creep.pos.isNearTo(newTargets[0], {reusePath: 50})) {
                    creep.transfer(newTargets[0], RESOURCE_ENERGY)
                }
                else {
                    creep.moveTo(newTargets[0]);
                }
            }
            else {

                let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE) &&
                            structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
                });
                if(target) {
                    if(creep.pos.isNearTo(target)) {
                        creep.transfer(target, RESOURCE_ENERGY);
                    }
                    else {
                        creep.moveTo(target);
                    }
                }
            }
        }
    
    },

    claimDroppedEnergy: function(creep) {
        if(creep.memory.source) {
            let source = Game.getObjectById(creep.memory.source);
            if(source) {
                return;
            }
        }
        let closestSource = creep.pos.findClosestByRange(this.findDroppedEnergy(creep));
        if(!closestSource) return;
        creep.memory.source = closestSource.id;
    
    },

    getDroppedEnergy: function(creep) {
        let droppedEnergy = creep.room.find(FIND_DROPPED_ENERGY);
        Memory.neededCarriers = droppedEnergy.length;

        return droppedEnergy;
    },

    findDroppedEnergy: function(creep) {
        let droppedEnergy = creep.room.find(FIND_DROPPED_ENERGY);

        let carriersWithAssignedDroppedEnergy = _.filter(Game.creeps, c => (c.memory.role === 'carrier' || c.memory.role === 'remoteCarrier') && c.memory.source);

        var unclaimedSources = droppedEnergy;
        _.forEach(carriersWithAssignedDroppedEnergy, function(c) {
            let carrierSource = Game.getObjectById(c.memory.source);
            _.pull(unclaimedSources, carrierSource);

        });
    
        Memory.neededCarriers = unclaimedSources.length;
        Memory.neededCarriers = (Memory.neededCarriers < Memory.neededHarvesters) ? Memory.neededHarvesters : Memory.neededCarriers;
        return unclaimedSources;
    },

    pickUpEnergy: function(creep) {
        let source = Game.getObjectById(creep.memory.source);
        if(!source) return;
    
        if(!creep.pos.isNearTo(source)) {
            creep.moveTo(source, {reusePath: 20});
        }
    
        creep.pickup(source);
    
    },

    getSpawnEnergy: function(creep) {

        if(!creep.pos.isNearTo(Game.spawns[0])) {
            creep.moveTo(Game.spawns[0], {reusePath: 100});
        }
        else {
            Game.spawns[0].transferEnergy(creep);
        }
    },

    claimSpawnEnergy: function(creep) {

    },

    takeSpawnEnergy: function(creep) {
        this.claimSpawnEnergy(creep);
        this.getSpawnEnergy(creep);
    },

    upgradeController: function(creep) {

        if(creep.upgradeController(Game.spawns[0].room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns[0].room.controller, {reusePath: 100});
        }creep.upgradeController(Game.spawns[0].room.controller);

    },

    getEnergy: function(creep) {
        var targets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE) &&
                    structure.store.energy > 0;
            }
        });

        if(targets.length > 0) {
            var target = creep.pos.findClosestByRange(targets);
            if(target.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else {


            if(Memory.needToCreateCreep == false && Game.spawns[0].energy > 0) {
                this.takeSpawnEnergy(creep);
            }
            else {

                let droppedEnergy = creep.pos.findClosestByRange(this.getDroppedEnergy(creep));
                if (droppedEnergy) {
                    creep.memory.source = droppedEnergy.id;
                    this.pickUpEnergy(creep);
                }
                else {
                    this.claimSource(creep);
                    this.harvestSource(creep);
                }
            }


        }
    },

    giveTowersEnergy: function(creep) {
        let towers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity)
        });
        if(towers.length > 0) {
            if (creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(towers[0], {reusePath: 100});
            }
        }
        else {
            this.upgradeController(creep);
        }
    },

    /*
     if(creep.memory.exitTarget != 0) {
     console.log("Creep "+creep.name+"does not have an exitTarget!");
     var route = Game.map.findRoute(creep.room, destRoom);

     if (route.length == 0) {
     return;
     }
     var exit_dir = route[0].exit;
     var exit_arr = creep.room.find(exit_dir);
     if (exit_arr.length == 0) {
     return false;
     }
     var exit_target = creep.pos.findClosestByRange(exit_arr);
     creep.memory.exitTarget = exit_target.id;
     var r = creep.moveTo(exit_target);
     }
     else {
     creep.moveTo(Game.getObjectById(creep.memory.exitTarget), {reusePath: 100})
     }
     */


    moveToRoom(creep, destRoom) {

        if(creep.room.name != destRoom) {
            creep.moveTo(new RoomPosition(25, 25, destRoom), {reusePath: 20});
        }
    },

    getOffExits(creep) {
        let x = creep.pos.x;
        let y = creep.pos.y;
        if(creep.pos.x === 0) {
            x = 1;
        }
        else if(creep.pos.x === 49) {
            x = 48;
        }

        if(creep.pos.y === 0) {
            y = 1;
        }
        else if(creep.pos.y === 49) {
            y = 48;
        }

        if(x == creep.pos.x && y == creep.pos.y) {
            return false;
        }
        creep.moveTo(x, y);
        return true;

    }
};
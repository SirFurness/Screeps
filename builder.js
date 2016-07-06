var helper = require('helper');
var upgrader = require('upgrader');

module.exports = {
    build: function(creep) {
        let maxBuilders = 2;

        let constructSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES).length;

        if(constructSites % 2 == 0) {
            Memory.neededBuilders = constructSites / 2;
        }
        else {
            Memory.neededBuilders = (constructSites+1)/2
        }

        Memory.neededBuilders = (Memory.neededBuilders > maxBuilders) ? maxBuilders : Memory.neededBuilders;

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        else if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }
        
        if(creep.memory.building) {
            let constructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            let importantSites = _.filter(constructionSites, function(o) {
               return o.structureType == STRUCTURE_TOWER ||
                       o.structureType == STRUCTURE_WALL ||
                       o.structureType == STRUCTURE_RAMPART ||
                       o.structureType == STRUCTURE_EXTENSION
            });
            if(importantSites.length > 0) {
                constructionSites = importantSites;
            }
            if(constructionSites[0]) {
                if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSites[0]);
                }
            }
            else {
                upgrader.upgrade(creep);
            }
        }
        else {
            helper.getEnergy(creep);
        }

    }
};
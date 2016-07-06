var helper = require('helper');

module.exports = {
    defend: function(creep) {

        let allHostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        let hostiles;
        if(allHostiles) {
            hostiles = _.filter(allHostiles, function (o) {
                return (o.getActiveBodyparts(HEAL) != 0);
            });
            if(hostiles.length == 0) {
                hostiles = _.filter(allHostiles, function (o) {
                    return o.getActiveBodyparts(ATTACK) != 0 || o.getActiveBodyparts(RANGED_ATTACK) != 0;
                });
            }
        }

        if(hostiles.length == 0) {
            hostiles = allHostiles;
        }

        if(hostiles.length > 0) {
            Memory.neededDefenders = hostiles.length * 2;
        }
        else {
            Memory.neededDefenders = 0;
        }

        if(hostiles.length > 0) {
            Memory.hostiles = true;
            let enemy = creep.pos.findClosestByPath(hostiles);
            if(creep.pos.inRangeTo(enemy, 3)) {
                creep.rangedAttack(enemy);
            }
            else {
                creep.moveTo(enemy);
            }
        }
        else {
            Memory.hostiles = false;
        }


    }
};
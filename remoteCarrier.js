var helper = require('helper');


module.exports = {

    run: function(creep) {
        if (creep.room.name != "W32S11" && !creep.memory.carrying) {

            helper.moveToRoom(creep, "W32S11");


        }
        else {

            Memory.neededRemoteCarriers = Memory.neededRemoteHarvesters;

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
                if(creep.pos.y == 0){
                    creep.moveTo(8, 1);
                }
            }
        }
    }

};
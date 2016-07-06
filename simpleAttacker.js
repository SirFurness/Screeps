var helper = require('helper');

module.exports = {

    run: function(creep) {
        if(Game.flags.simpleAttack) {
            Memory.neededSimpleAttackers = 4;
            Memory.neededSimpleHealers = 4;

            if(creep.room.name != Game.flags.simpleAttack.room.name) {
                helper.moveToRoom(creep, Game.flags.simpleAttack.room.name);
            }
            else {
                if(helper.getOffExits(creep)) {return;}
                //TODO: write the attacking code
            }
        }
    }

};
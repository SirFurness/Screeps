var helper = require('helper');

module.exports = {

    run: function(creep) {
        if(Game.flags.simpleAttack) {
            Memory.neededSimpleAttackers = 1;

            if(creep.room.name != Game.flags.simpleAttack.room.name) {
                helper.moveToRoom(creep, Game.flags.simpleAttack.room.name);
            }
            else {
                if(helper.getOffExits(creep)) {return;}
                //TODO: write the attacking code
                if(!creep.memory.path) {
                    let goal = creep.room.find(FIND_HOSTILE_SPAWNS)[0];
                    let structures = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) =>
                            structure.structureType == STRUCTURE_WALL ||
                            structure.structureType == STRUCTURE_RAMPART

                    })
                    let maxStructure = _max(structures, function(o) {
                        return o.hits;
                    });
                    let path = PathFinder.search(creep.pos, goal, {
                        roomCallback: function(roomName) {
                            let room = Game.rooms[roomName];

                            if(!room) return;


                        }
                    })
                }

            }
        }
    }

};
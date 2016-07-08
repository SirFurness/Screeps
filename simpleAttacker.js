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
                var goal = creep.room.find(FIND_HOSTILE_SPAWNS)[0];
                if(creep.dismantle(goal) == ERR_NOT_IN_RANGE) {
                    if(!creep.memory.path) {
                        let structures = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) =>
                                structure.structureType == STRUCTURE_WALL ||
                                structure.structureType == STRUCTURE_RAMPART

                        }
                        let maxStructure = _max(structures, function(o) {
                            return o.hits;
                        });
                        let path = PathFinder.search(creep.pos, goal, {
                            roomCallback: function(roomName) {
                                let room = Game.rooms[roomName];

                                if(!room) return;

                                let costs = new PathFinder.CostMatrix;
                                _.forEach(structures, function(structure) {
                                    let value;
                                    (structure.hits < 255) ? value = structure.hits : value = 254;

                                    costs.set(structure.pos.x, structure.pos.y, value);

                                });

                                return costs;

                            },
                            maxRooms: 1
                        })

                        creep.memory.path = path.serialize();

                    }

                    let pos = PathFinder.CostMatrix.deserialize(creep.memory.path).path[0];
                    creep.move(creep.pos.getDirectionTo(pos));

                }
            }
        }
        else {
            //TODO: Code for when attacking flag is gone
        }
    }

};

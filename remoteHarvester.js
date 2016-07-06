var helper = require('helper');
var harvester = require('harvester');

var sources = {
    0: {
        destRoom: "W32S11",
        dest: "Source1"
        //id: '576a9bd457110ab231d8806f'
    }
}


module.exports = {
    run: function(creep) {

        if(creep.room.name != "W32S11")  {
            helper.moveToRoom(creep, "W32S11");

        }
        else {


                let sources = creep.room.find(FIND_SOURCES);

                if(sources) {
                    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                    }
                }
        }
    }
};
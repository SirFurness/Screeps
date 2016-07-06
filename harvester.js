var helper = require('helper');

module.exports = {
    //harvesting
    harvest: function(creep) {
        helper.claimSource(creep);
        helper.harvestSource(creep);
    },
    firstHarvester: function(creep) {
            if(creep.carry.energy < creep.carryCapacity) {
                this.harvest(creep);
                //console.log("firstHarvester is harvesting.");
            }
            else {
                helper.takeEnergyBack(creep);
            }
    }
};
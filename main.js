var harvester = require('harvester');
var carrier = require('carrier');
var upgrader = require('upgrader');
var builder = require('builder');
var defender = require('defender');
var repairer = require('repairer');
var remoteHarvester = require('remoteHarvester');
var tower = require('tower');
var towerHelper = require('towerHelper');
var remoteCarrier = require('remoteCarrier');

module.exports.loop = function () {

	//clear unneeded memory'
	//console.log("deleting unneded memory");
	for(let i in Memory.creeps) {
		if(!Game.creeps[i]) {
			delete Memory.creeps[i];
		}
	}

	//update the creeps

    var last_cpu = Game.cpu.getUsed();
    var now_cpu = 0;
    var last_name = 'null';

	//console.log("looping through all creeps");
	for(let name in Game.creeps) {
		var creep = Game.creeps[name];

        now_cpu= Game.cpu.getUsed();
        if(last_name){
			if((now_cpu - last_cpu) > 0.9)
			console.log(last_name + ' cpu: '+((now_cpu - last_cpu)+'').substr(0,5) );
		}
        last_name= name+'('+creep.memory.role+')';
        last_cpu = now_cpu;

		identifyThreats(creep);

		if(creep.memory.threat != 0) {
			creep.moveTo(Game.spawns[0]);
		}
        else {
            updateCreep(creep);
        }

	}

	let structures = Game.spawns[0].room.find(FIND_MY_STRUCTURES);
	let towerAmt = 0;

	for(let i in structures) {
		let structure = structures[i];

		updateStructures(structure);
		if (structure.structureType == STRUCTURE_TOWER) {
			towerAmt += 1;
		}
	}

	Memory.neededTowerHelpers = towerAmt;

	//create the creeps
	//console.log("creating necessary creeps");
	createNeededCreeps();

}

var creepsDefinitions = {
	firstHarvester: {requiredParts: [CARRY, MOVE, WORK]},
	harvester: {requiredParts: [MOVE, WORK, WORK], optionalParts: [MOVE, WORK, WORK], maxParts: {WORK: 5}},
	carrier: {requiredParts: [CARRY, CARRY, MOVE], optionalParts: [CARRY, MOVE, MOVE]},
	upgrader: {requiredParts: [CARRY, MOVE, WORK], optionalParts: [CARRY, WORK, MOVE]},
	builder: {requiredParts: [CARRY, MOVE, WORK], optionalParts: [CARRY, MOVE, WORK]},
	defender: {requiredParts: [MOVE, RANGED_ATTACK,], optionalParts: [MOVE, RANGED_ATTACK]},
	repairer: {requiredParts: [WORK, MOVE, CARRY], optionalParts: [WORK, MOVE, CARRY]},
	remoteHarvester: {requiredParts: [MOVE, WORK, WORK], optionalParts: [MOVE, WORK, WORK]},
	towerHelper: {requiredParts: [CARRY, MOVE, WORK], optionalParts: [CARRY, MOVE , WORK]},
	remoteCarrier: {requiredParts: [CARRY, CARRY, MOVE], optionalParts: [CARRY, MOVE, MOVE]}
};

//building creeps
function createNeededCreeps() {
	if(Game.spawns[0].spawning) return;
	let rolePriority = [
            'firstHarvester',
			'harvester',
			'carrier',
			'upgrader',
			'repairer',
			'builder',
			'towerHelper',
			'defender',
			'remoteHarvester',
			'remoteCarrier'
	];

    for(let i in rolePriority) {
        let role = rolePriority[i];

        if(!(Memory['needed' + role.charAt(0).toUpperCase() + role.slice(1) + 's'] >= 0)) {
            Memory['needed' + role.charAt(0).toUpperCase() + role.slice(1) + 's'] = 1;
        }
    }

	let priority = prioritize(rolePriority);
	_.forEach(priority, (c) => {
		if(c != 'firstHarvester') {
			console.log("Need more " + c)
		}
	});

	if(priority.length > 1) {
		Memory.needToCreateCreep = true;
	}
	else {
		Memory.needToCreateCreep = false;
	}

	for(let a = 0; a < priority.length; a++) {
		let i = priority[a];
		let amountOfRole = _.sum(Game.creeps, (c) => c.memory.role == i);
		if (i == 'firstHarvester' && ((_.sum(Game.creeps, (c) => c.memory.role == 'harvester')) > 0 || (_.sum(Game.creeps, (c) => c.memory.role == 'firstHarvester')) > 0)) {
			continue;
		}
		else {
			var bodyparts = buildCreep(i);
			if (Game.spawns[0].canCreateCreep(bodyparts) === OK) {
				Game.spawns[0].createCreep(bodyparts, undefined, {role: i});
				console.log("Created creep with role " + i);
				break;
			}
		}
	}


}

function prioritize(rolePriority) {

	let priority = [];

	let distanceFromGoal = {};

	for(let i in rolePriority) {
		let role = rolePriority[i];
		//console.log(role);
		let amountOfRole = _.sum(Game.creeps, (c) => c.memory.role == role);

		if(amountOfRole == 0) {
			priority.push(role);

			if(role == 'harvester') {
				Memory.harvesterEmergency = true;
			}
			else {
				Memory.harvesterEmergency = false;
			}
            //_.forEach(priority, (c) => console.log(c));
		}
		else {
			let neededAmt = Memory['needed' + role.charAt(0).toUpperCase() + role.slice(1) + 's'];
			let distance = neededAmt-amountOfRole;
			console.log("Needed amount of " + role + " is " + neededAmt + " there are " + amountOfRole + ", " + distance + " are needed.");
			//console.log(role + " is " + distance + " away from the needed amount!");
			if(distance > 0) {
				//console.log("Need more " + role);
				distanceFromGoal[role] = distance;
			}
		}
	}


	_.sortBy(distanceFromGoal);

	for(let i in distanceFromGoal) {
		priority.push(i);
	}


	return priority;
}

function buildCreep(role) {
	let cost = 0;
	let amountOfRole = _.sum(Game.creeps, (c) => c.memory.role == role);
	var maximumCost = maximumCost = Game.spawns[0].room.energyCapacityAvailable;;
	if(amountOfRole == 0) {
		maximumCost = Game.spawns[0].room.energyAvailable;
	}

	let bodyparts = [];
	//let definition = creepsDefinitions[role];

	//if(creepsDefinitions[role].onlyParts) {
	//	return creepsDefinitions[role].onlyParts;
	//}

	//if(creepsDefinitions[role].perfectParts && Game.spawns[0].canCreateCreep(creepsDefinitions[role].perfectParts) === OK) {
	//	return creepsDefinitions[role].perfectParts;
	//}

	let building = true;
	while(creepsDefinitions[role].optionalParts && building) {
		_.forEach(creepsDefinitions[role].optionalParts, bodypart => {
			cost += BODYPART_COST[bodypart];
			if(cost > maximumCost) {
				building = false;
			}
		});
		if(building && (bodyparts.length + creepsDefinitions[role].optionalParts.length) <= 50)
			bodyparts = bodyparts.concat(creepsDefinitions[role].optionalParts);
	}
	return bodyparts;

}

//updatingCreeps
function updateCreep(creep) {
	//console.log("updating creeps");
	switch(creep.memory.role) {
		case 'firstHarvester':
			harvester.firstHarvester(creep);
			break;
		case 'harvester':
			harvester.harvest(creep);
			break;
		case 'carrier':
			carrier.carry(creep);
			break;
		case 'upgrader':
			upgrader.upgrade(creep);
			break;
		case 'builder':
			builder.build(creep);
			break;
		case 'defender':
			defender.defend(creep);
			break;
		case 'repairer':
			repairer.run(creep);
			break;
		case 'remoteHarvester':
			remoteHarvester.run(creep);
			break;
		case 'towerHelper':
			towerHelper.run(creep);
			break;
		case 'remoteCarrier':
			remoteCarrier.run(creep);
			break;
		default:
			break;
	}

}

function updateStructures(structure) {



	switch(structure.structureType) {
		case STRUCTURE_TOWER:
			tower.run(structure);
			break;
		default:
			break;
	}
}


//identifying threats
function identifyThreats(creep) {

	if(creep.pos.inRangeTo(Game.spawns[0], 1)) {
		creep.memory.threat = 0;
	}

	if(Game.spawns[0].room.find(FIND_HOSTILE_CREEPS) > 0) {
		Memory.hostiles = true;
	}


	let allHostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
	let hostiles = _.filter(allHostiles, function(o) {
		return o.getActiveBodyparts(ATTACK) != 0 || o.getActiveBodyparts(RANGED_ATTACK) != 0;
	});
	if(hostiles.length > 0) {
		if(creep.memory.role != 'defender') {
			creep.memory.threat = 5;
		}
	}

}

const path = require('path');
const colors = require('colors/safe');
const exec = require('child_process').exec;
const figlet = require('figlet');

const utils = require('./utils');

function execute(command) {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if(error) reject(error)
			resolve(stdout, stderr)
		});
	})
}

function printTitle() {
	return () => {
		return new Promise(function (resolve, reject) {
			figlet('Geekify', function (err, data) {
				if (err) {
					console.log('Something went wrong...');
					console.dir(err);
					reject(err);
				}
				console.log(data)
				resolve();
			});
		});
	}	
}

function readGeekJsonFile() {
	return new Promise((resolve, reject) => {
		utils.readJsonFile(path.resolve(process.cwd(), "geek.json")).then((json) => {
			resolve(json)
		})
	})
}

function getNextBranchName(json) {
	return new Promise((resolve, reject) => {
		geekExecuteCommand('git rev-parse --abbrev-ref HEAD').then((branchName) => {
			let res  = json;
			let index = res.branches.indexOf(branchName.trim())
			let branch = index != -1 ?
				res.branches[index + 1] :
				res.branches.shift();
			resolve(branch)	
		})
	})
}

function checkoutToBranch(branchName) {
	return new Promise((resolve, reject) => {
		geekExecuteCommand('git checkout ' + branchName).then((res) => {
			resolve(res)
		})
	})
}

function getPreviousBranchName(json) {
	return new Promise((resolve, reject) => {
		geekExecuteCommand('git rev-parse --abbrev-ref HEAD').then((branchName) => {
			let res  = json;
			let index = res.branches.indexOf(branchName.trim())
			let branch = index != -1 ?
				res.branches[index - 1] :
				res.branches.shift();
			resolve(branch)	
		})
	})
}

function getCurrentBranchName(json) {
	return new Promise((resolve, reject) => {
		geekExecuteCommand('git rev-parse --abbrev-ref HEAD').then((branchName) => {
			let res  = json;
			let index = res.branches.indexOf(branchName.trim())
			let branch = index != -1 ?
				res.branches[index] : '';
			resolve([json, branch])	
		})
	})
}

function checkBranchName([json, branchName]) {
	return new Promise((resolve, reject) => {
		let res = json
		let index = res.branches.indexOf(branchName.trim())
		if(index != -1) {
			resolve(branchName.trim())
		}
	})
}

function getFirstBranchName(json) {
	return new Promise((resolve, reject) => {
		let res = json
		let branch = res.branches.shift();
		resolve(branch.trim())
	})
}

function showDiff([json, branchName]) {
	return new Promise((resolve, reject) => {
		let res = json
		let index = res.branches.indexOf(branchName.trim())
		if(index > 0) {
			let prev = index != -1 ?
			res.branches[index - 1] :
			res.branches.shift();
			return geekExecuteCommand(`git diff  ${prev || branchName.trim()} ${branchName.trim()} --color=always`).then((diff) => {
				resolve(diff)
			})
		} else {
			return ''
		}
	})
}

/**
 * Execute any terminal command
 *
 * @param {string} [command='ls']
 * @returns Promise
 */
let geekExecuteCommand = function(command = 'ls') {
	return new Promise((resolve, reject) => {
		execute(command).then((stdout, stderr) => {
			if (stdout) {
				console.log('Program stdout:', colors.green(stdout));
			} else if (stderr) {
				console.log('Program stderr:', colors.red(stderr));
			}
			resolve(stdout, stderr);
		}).catch((err) => {
			console.log(err, '............err')
			reject(err)
		})
	});
}

let geekPerformInitAction = function() {
	let queue = [
		geekExecuteCommand('git checkout geek-config'),
		utils.readJsonFile(path.resolve(process.cwd(), "geek-config.json"))
	]
	return utils.PromiseSeries(queue);
}

let geekIt = function() {
	let ignoreText = "node_modules\ngeek.json"
	let configJson = {
		"branches": [],
	}
	utils.PromiseSeries([
		utils.printTitle(),
		geekExecuteCommand('git init'),
		geekExecuteCommand('git checkout -b master'),
		utils.updateJsonFile(path.resolve(process.cwd(), ".gitignore"), ignoreText),
		geekExecuteCommand('git add .gitignore && git commit -m "Add: init"'),
		geekExecuteCommand('git checkout -b geek-config'),
		utils.updateJsonFile(path.resolve(process.cwd(), "geek-config.json"), JSON.stringify(configJson, null, 4)),
		geekExecuteCommand('git add ' + path.resolve(process.cwd() + "geek-config.json") + ' && git commit -m "Add: init config"'),
		geekExecuteCommand('git checkout master'),
	]).then((res) => {
		console.log('Success')
	}).catch((err) => {
		console.log(err, '............err')
	})
}

// there would be only one file geek.json
// earlier we were using geek-config and geek.json as separate file
// when we were modifying geek.json file for every operation to keep
// track of the tute, now we will be using diff method
// geekIt();

let geekInit = function() {
	utils.PromiseSeries([
		utils.printTitle(),
		geekExecuteCommand('git fetch origin'),
		geekExecuteCommand('git checkout geek-config'),
		utils.copyJsonFile(path.resolve(process.cwd(), "geek-config.json"), path.resolve(process.cwd(), "geek.json")),
		geekExecuteCommand('git checkout master'),
	]).then((res) => {
		console.log('Success')
	}).catch((err) => {
		console.log(err, '............err')
	})
}

let geekNext = () => {
	// why waterfall?
	// because we need res - config json for every next operation
	utils.PromiseWaterfall([
		readGeekJsonFile,
		getNextBranchName,
		checkoutToBranch
	]).then((res) => {
		console.log(res, "res", res.branches)
		// git get currrent branch name only
	}).catch((err) => {
		console.log(err, 'err')
	})
}

let geekPrevious = () => {
	// why waterfall?
	// because we need res - config json for every next operation
	utils.PromiseWaterfall([
		readGeekJsonFile,
		getPreviousBranchName,
		checkoutToBranch
	]).then((res) => {
		console.log(res, "res", res.branches)
		// git get currrent branch name only
	}).catch((err) => {
		console.log(err, 'err')
	})
}



let geekJumpTo = (branchName) => {
	// why waterfall?
	// because we need res - config json for every next operation
	utils.PromiseWaterfall([
		readGeekJsonFile,
		(json) => {
			return new Promise((resolve, reject) => {
				resolve([json, branchName])
			})
		},
		checkBranchName,
		checkoutToBranch
	]).then((res) => {
		console.log(res, "res", res.branches)
		// git get currrent branch name only
	}).catch((err) => {
		console.log(err, 'err')
	})
}

let geekReset = () => {
	// why waterfall?
	// because we need res - config json for every next operation
	utils.PromiseWaterfall([
		readGeekJsonFile,
		getFirstBranchName,
		checkoutToBranch
	]).then((res) => {
		console.log(res, "res", res.branches)
		// git get currrent branch name only
	}).catch((err) => {
		console.log(err, 'err')
	})
}

let geekDiff = () => {
		// why waterfall?
	// because we need res - config json for every next operation
	utils.PromiseWaterfall([
		readGeekJsonFile,
		getCurrentBranchName,
		showDiff
	]).then((diff) => {
		console.log('done')
		// git get currrent branch name only
	}).catch((err) => {
		console.log(err, 'err')
	})
}
module.exports = {
	"execute": execute,
	"geekPerformInitAction": geekInit,
	"geekPerformResetAction": geekReset,
	"geekPerformNextAction": geekNext,
	"geekPerformPreviousAction": geekPrevious,
	"geekPerformJumpToAction": geekJumpTo,
	"geekPerformShowDiffAction": geekDiff,
	"geekExecuteCommand": geekExecuteCommand
};

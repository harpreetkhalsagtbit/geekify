const path = require('path');
const colors = require('colors/safe');
const exec = require('child_process').exec;
const figlet = require('figlet');

const utils = require('./utils');
/**
 * Promisified Wrapper for node exec
 * @param  {String} command
 * @returns Promise
 */
function execute(command) {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if(error) reject(error)
			resolve(stdout, stderr)
		});
	})
}
/**
 * Pretty print cli name
 * @returns Promise
 */
function printTitle() {
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
/**
 * Promisified Read fs
 * @returns Promise
 */
function readGeekJsonFile() {
	return new Promise((resolve, reject) => {
		utils.readJsonFile(path.resolve(process.cwd(), "geek.json")).then((json) => {
			resolve(json)
		})
	})
}
/**
 * Return name of next branch as in Geek config json
 * @param  {JSON} json Geek config JSON
 * @returns Promise
 */
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
/**
 * Perform 'git checkout' to branch
 * @param  {String} branchName
 * @returns Promise
 */
function checkoutToBranch(branchName) {
	return new Promise((resolve, reject) => {
		geekExecuteCommand('git checkout ' + branchName).then((res) => {
			resolve(res)
		})
	})
}
/**
 * Return name of previous branch as in Geek config json
 * @param  {JSON} json
 * @returns Promise
 */
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
/**
 * Return name of current branch and verify with Geek config json
 * @param  {JSON} json
 * @returns Promise
 */
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
/**
 * verify branch name within Geek config json
 * @param  {JSON} [json
 * @param  {String} branchName]
 * @returns Promise
 */
function checkBranchName([json, branchName]) {
	return new Promise((resolve, reject) => {
		let res = json
		let index = res.branches.indexOf(branchName.trim())
		if(index != -1) {
			resolve(branchName.trim())
		}
	})
}

/**
 * Return name of first branch in Geek config json
 * @param  {JSON} json
 * @returns Promise
 */
function getFirstBranchName(json) {
	return new Promise((resolve, reject) => {
		let res = json
		let branch = res.branches.shift();
		resolve(branch.trim())
	})
}
/**
 * Return diffrence between two consecutive branches in Geek config json
 * Current and Next branches are compared
 * @param  {JSON} [json
 * @param  {String} branchName]
 * @returns Promise
 */
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
 * Fetch all branches
 */
function geekFetchOrigin() {
	return new Promise((resolve, reject) => {
		return geekExecuteCommand('git fetch origin').then(() => {
			resolve()
		})
	})
}
/**
 * Checkout to geek-config branch to get geek.json
 */
function geekCheckoutGeekConfig() {
	return new Promise((resolve, reject) => {
		return geekExecuteCommand('git checkout geek-config').then(() => {
			resolve()
		})
	})
}
/**
 * Get back to master branch, now we have geek.json for every branch
 * as it is in gitignore, changing branches will cause no issue because of
 * this untracker or uncommited file
 */
function geekCheckoutMaster() {
	return new Promise((resolve, reject) => {
		return geekExecuteCommand('git checkout master').then(() => {
			resolve()
		})
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
/**
 * For dev only. Geekify your code repo. 
 */
let geekIt = function() {
	let ignoreText = "node_modules\ngeek.json"
	let configJson = {
		"branches": [],
	}
	utils.PromiseSeries([
		printTitle(),
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

/**
 * there would be only one file geek.json
 * earlier we were using geek-config and geek.json as separate file
 * when we were modifying geek.json file for every operation to keep
 * track of the tute, now we will be using diff method
 * geekIt();
*/
let geekInit = function() {
	utils.PromiseSeries([
		printTitle,
		geekFetchOrigin,
		geekCheckoutGeekConfig,
		utils.copyJsonFile(path.resolve(process.cwd(), "geek-config.json"), path.resolve(process.cwd(), "geek.json")),
		geekCheckoutMaster
	]).then((res) => {
		console.log('Success')
	}).catch((err) => {
		console.log(err, '............err')
	})
}
/**
 * Perform geek next operation
 */
let geekNext = () => {
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

/**
 * Perform geek previous operation
 */
let geekPrevious = () => {
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

/**
 * Perform geek jump operation
 * Jump to any branch defined in geek.json
 */
let geekJumpTo = (branchName) => {
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

/**
 * Move to default or very first branhc defined in geek.json
 */
let geekReset = () => {
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
/**
 * Perform geek diff operation - difference in two branches
 * Current and Previous branch
 */
let geekDiff = () => {
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

const path = require('path');
const colors = require('colors/safe');
const exec = require('child_process').exec;

const utils = require('./utils');

let execute = (command) => {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if(error) reject(error)
			resolve(stdout, stderr)
		});
	})
}

/**
 * Execute any terminal command
 *
 * @param {string} [command='ls']
 * @returns Promise
 */
let geekExecuteCommand = (command = 'ls') => {
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

let geekPerformInitAction = () => {
	let queue = [
		geekExecuteCommand('git checkout geek-config'),
		utils.readJsonFile(path.join(process.cwd(), "geek-config.json"))
	]
	return utils.PromiseSeries(queue);
}

let geekIt = () => {
	let ignoreText = "node_modules\ngeek.json"
	let configJson = {
		"branches": [],
	}
	utils.PromiseSeries([
		utils.printTitle(),
		geekExecuteCommand('git init'),
		geekExecuteCommand('git checkout -b master'),
		utils.updateJsonFile(path.join(process.cwd(), ".gitignore"), ignoreText),
		geekExecuteCommand('git add .gitignore && git commit -m "Add: init"'),
		geekExecuteCommand('git checkout -b geek-config'),
		utils.updateJsonFile(path.join(process.cwd(), "geek-config.json"), JSON.stringify(configJson, null, 4)),
		geekExecuteCommand('git add ' + path.join(process.cwd() + "geek-config.json") + ' && git commit -m "Add: init config"'),
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

let geekInit = () => {
	utils.PromiseSeries([
		utils.printTitle(),
		geekExecuteCommand('git fetch origin'),
		geekExecuteCommand('git checkout geek-config'),
		utils.copyJsonFile(path.join(process.cwd(), "geek-config.json"), path.join(process.cwd(), "geek.json")),
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
		funcA,
		funcB,
		funcX,
		funcY
	]).then((res) => {
		console.log(res, "res", res.branches)
		// git get currrent branch name only
	}).catch((err) => {
		console.log(err, 'err')
	})
}

let funcA  = () => {
	return new Promise((resolve, reject) => {
		utils.readJsonFile(path.join(process.cwd(), "geek.json")).then((json) => {
			resolve(json)
		})
	})
}

let funcB  = (json) => {
	return new Promise((resolve, reject) => {
		geekExecuteCommand('git rev-parse --abbrev-ref HEAD').then((branchName) => {
			resolve([json, branchName])
		})
	})
}

let funcX  = ([json, branchName]) => {
	return new Promise((resolve, reject) => {
		res = json
		let index = res.branches.indexOf(branchName.trim())
		let branch = index != -1 ?
			res.branches[index + 1] :
			res.branches.shift();
			resolve(branch)
	})
}

let funcY  = (branchName) => {
	return geekExecuteCommand('git checkout ' + branchName)
}


let funcXX  = ([json, branchName]) => {
	return new Promise((resolve, reject) => {
		let res = json
		let index = res.branches.indexOf(branchName.trim())
		let branch = index != -1 ?
			res.branches[index - 1] :
			res.branches.shift();
			resolve(branch)
	})
}

let geekPrevious = () => {
	// why waterfall?
	// because we need res - config json for every next operation
	utils.PromiseWaterfall([
		funcA,
		funcB,
		funcXX,
		funcY
	]).then((res) => {
		console.log(res, "res", res.branches)
		// git get currrent branch name only
	}).catch((err) => {
		console.log(err, 'err')
	})
}


let funcYY  = ([json, branchName]) => {
	return new Promise((resolve, reject) => {
		let res = json
		let index = res.branches.indexOf(branchName.trim())
		if(index != -1) {
			resolve(branchName.trim())
		}
	})
}

let geekJumpTo = (branchName) => {
	// why waterfall?
	// because we need res - config json for every next operation
	utils.PromiseWaterfall([
		funcA,
		(json) => {
			return new Promise((resolve, reject) => {
				resolve([json, branchName])
			})
		},
		funcYY,
		funcY
	]).then((res) => {
		console.log(res, "res", res.branches)
		// git get currrent branch name only
	}).catch((err) => {
		console.log(err, 'err')
	})
}


let funcZZ  = (json) => {
		return new Promise((resolve, reject) => {
			let res = json
			let branch = res.branches.shift();
			resolve(branch.trim())
		})
}

let geekReset = () => {
	// why waterfall?
	// because we need res - config json for every next operation
	utils.PromiseWaterfall([
		funcA,
		funcZZ,
		funcY
	]).then((res) => {
		console.log(res, "res", res.branches)
		// git get currrent branch name only
	}).catch((err) => {
		console.log(err, 'err')
	})
}

let funcZZZ  = ([json, branchName]) => {
	return new Promise((resolve, reject) => {
		let res = json
		let index = res.branches.indexOf(branchName.trim())
		if(index > 0) {
			let prev = index != -1 ?
			res.branches[index - 1] :
			res.branches.shift();
			resolve([prev, branchName])
			// return geekExecuteCommand(`git diff ${prev || current.trim()} ${current.trim()} --color=always`)()
		} else {
			return;
		}

		resolve(branch.trim())
	})
}

let funcDiff  = ([prev, current]) => {
	return new Promise((resolve, reject) => {
		return geekExecuteCommand(`git diff  ${prev || current.trim()} ${current.trim()} --color=always`).then((diff) => {
			resolve(diff)
		})
	})
}

let geekDiff = () => {
		// why waterfall?
	// because we need res - config json for every next operation
	utils.PromiseWaterfall([
		funcA,
		funcB,
		funcZZZ,
		funcDiff
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

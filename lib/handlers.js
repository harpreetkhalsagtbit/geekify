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
	return () => {
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
		funcA(),
		funcB(),
		funcX(),
		funcY()
	]).then((res) => {
		console.log(res, "res", res.branches)
		// git get currrent branch name only
	}).catch((err) => {
		console.log(err, 'err')
	})
}

let funcA  = (res) => {
	return (prevValue) => {
		return new Promise((resolve, reject) => {
			utils.readJsonFile(path.join(process.cwd(), "geek.json"))().then((json) => {
				resolve({
					json
				})
			})
		})
	}
}

let funcB  = (res) => {
	return (prevValue) => {
		res = res || prevValue.json
		return new Promise((resolve, reject) => {
			geekExecuteCommand('git rev-parse --abbrev-ref HEAD')().then((branchName) => {
				resolve({
					json: prevValue.json,
					branchName
				})
			})
		})
	}
}

let funcX  = (res) => {
	return (prevValue) => {
		return new Promise((resolve, reject) => {
			console.log(res, prevValue)
			res = res || prevValue.json
			let index = res.branches.indexOf(prevValue.branchName.trim())
			let branch = index != -1 ?
				res.branches[index + 1] :
				res.branches.shift();
				resolve(branch)
		})
	}
}

let funcY  = (res) => {
	return (prevValue) => {
			res = res || prevValue
		return geekExecuteCommand('git checkout ' + res)()
	}
}

let geekPreviousX = () => {
	// why waterfall?
	// because we need res - config json for every next operation
	utils.PromiseWaterfall([
		utils.readJsonFile(path.join(process.cwd(), "geek.json")),
	]).then((res) => {
		// git get currrent branch name only
		geekExecuteCommand('git rev-parse --abbrev-ref HEAD')().then((branchName) => {
			let index = res.branches.indexOf(branchName.trim())
			let branch = index != -1 ?
				res.branches[index - 1] :
				res.branches.shift();
			if(branch) {
				return geekExecuteCommand('git checkout ' + branch)()
			} else {
				return ;
			}
		}).then(() => {
			console.log('done')
		}).catch((err) => {
			console.log(err, 'err')
		})
	}).catch((err) => {
		console.log(err, 'err')
	})
}
let funcXX  = (res) => {
	return (prevValue) => {
		return new Promise((resolve, reject) => {
			console.log(res, prevValue)
			res = res || prevValue.json
			let index = res.branches.indexOf(prevValue.branchName.trim())
			let branch = index != -1 ?
				res.branches[index - 1] :
				res.branches.shift();
				resolve(branch)
		})
	}
}

let geekPrevious = () => {
	// why waterfall?
	// because we need res - config json for every next operation
	utils.PromiseWaterfall([
		funcA(),
		funcB(),
		funcXX(),
		funcY()
	]).then((res) => {
		console.log(res, "res", res.branches)
		// git get currrent branch name only
	}).catch((err) => {
		console.log(err, 'err')
	})
}


let geekJumpToX = (branchName) => {
	// why waterfall?
	// because we need res - config json for every next operation
	utils.PromiseWaterfall([
		utils.readJsonFile(path.join(process.cwd(), "/geek.json")),
	]).then((res) => {
		let index = res.branches.indexOf(branchName.trim())
		if(index != -1) {
			return geekExecuteCommand('git checkout ' + branchName)().then(() => {
				console.log('done')
			}).catch((err) => {
				console.log(err, 'err')
			})
		} else {
			console.log('invalid option')
			return ;
		}
	}).catch((err) => {
		console.log(err, 'err')
	})
}

let funcYY  = (branchName) => {
	return (prevValue) => {
		return new Promise((resolve, reject) => {
			let res = prevValue.json
			console.log(res, prevValue)
			let index = res.branches.indexOf(branchName.trim())
			if(index != -1) {
				resolve(branchName.trim())
			}
		})
	}
}

let geekJumpTo = (branchName) => {
	// why waterfall?
	// because we need res - config json for every next operation
	utils.PromiseWaterfall([
		funcA(),
		funcYY(branchName),
		funcY()
	]).then((res) => {
		console.log(res, "res", res.branches)
		// git get currrent branch name only
	}).catch((err) => {
		console.log(err, 'err')
	})
}

let geekReset = () => {
	utils.PromiseWaterfall([
		utils.readJsonFile(path.join(process.cwd(), "/geek.json")),
	]).then((res) => {
		// checkout to main branch - which is at index 0 of the branch array
		let branch = res.branches.shift();
		return geekExecuteCommand('git checkout ' + branch)()
	}).then(() => {
		console.log('done')
	}).catch((err) => {
		console.log(err, 'err')
	})
}

/**
 * Show code fiff between current and previous branch
 *
 * @returns Promise
 */
let geekDiff = () => {
	// why waterfall?
	// because we need res - config json for every next operation
	utils.PromiseWaterfall([
		utils.readJsonFile(path.join(process.cwd(), "/geek.json")),
	]).then((res) => {
		// git get currrent branch name only
		geekExecuteCommand('git rev-parse --abbrev-ref HEAD')().then((current) => {
			let index = res.branches.indexOf(current.trim())
			if(index > 0) {
				let prev = index != -1 ?
				res.branches[index - 1] :
				res.branches.shift();
				return geekExecuteCommand(`git diff ${prev || current.trim()} ${current.trim()} --color=always`)()
			} else {
				return;
			}
		}).then(() => {
			console.log('done')
		}).catch((err) => {
			console.log(err, 'err')
		})
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

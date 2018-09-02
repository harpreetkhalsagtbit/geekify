var fs = require("fs");
var exec = require('child_process').exec;
var colors = require('colors/safe');
var figlet = require('figlet');
var path = require('path');

function execute(command, callback) {
	exec(command, function (error, stdout, stderr) {
		callback(error, stdout, stderr);
	});
}

/**
 * Utility function for executing promises in series, helping
 * writing clean code.
 *
 * @param {Array} arr 
 * @returns Promise
 */
const PromiseSeries = (arr = []) => {
	let ret = Promise.resolve(null);
	// let res = [];
	return arr.reduce((result, item, index) => {
		return result.then((value) => {
			return item().then((val) => {
				// res.push(val)
				return val;
			})
		})
	}, ret)
}

/**
 * Execute any terminal command
 *
 * @param {string} [command='ls']
 * @returns Promise
 */
let geekExecuteCommand = (command = 'ls') => {
	return () => {
		return new Promise(function (resolve, reject) {
			execute(command, function (err, stdout, stderr) {
				if (err) reject(err);
				else {
					if (stdout) {
						console.log('Program stdout:', colors.green(stdout));
					} else if (stderr) {
						console.log('Program stderr:', colors.red(stderr));
					}
					resolve(stdout);
				}
			});
		});
	}
}


let copyJsonFile = (source, target) => {
	return () => {
		return new Promise(function (resolve, reject) {
			fs.copyFile(source, target, (err) => {
				if (err) reject(err);
				else {
					resolve()
				}
			});
		});
	}
}

let readJsonFile = (fileName) => {
	return () => {
		return new Promise(function (resolve, reject) {
			fs.readFile(fileName, function (err, data) {
				if (err) reject(err);
				else {
					resolve(JSON.parse(data.toString()))
				}
			});
		});
	}
}

let updateJsonFile = (fileName, json) => {
	return () => {
		return new Promise(function (resolve, reject) {
			fs.writeFile(fileName, json, function (err, data) {
				if (err) reject(err);
				else {
					resolve();
				}
			});
		});
	}
}

let geekPerformInitAction = () => {
	let queue = [
		geekExecuteCommand('git checkout geek-config'),
		readJsonFile(path.join(process.cwd(), "geek-config.json"))
	]
	return PromiseSeries(queue);
}

let printTitle = () => {
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

let geekIt = () => {
	let ignoreText = "node_modules\ngeek.json"
	let configJson = {
		"branches": [],
	}
	PromiseSeries([
		printTitle(),
		geekExecuteCommand('git init'),
		geekExecuteCommand('git checkout -b master'),
		updateJsonFile(path.join(process.cwd(), ".gitignore"), ignoreText),
		geekExecuteCommand('git add .gitignore && git commit -m "Add: init"'),
		geekExecuteCommand('git checkout -b geek-config'),
		updateJsonFile(path.join(process.cwd(), "geek-config.json"), JSON.stringify(configJson, null, 4)),
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
	PromiseSeries([
		printTitle(),
		geekExecuteCommand('git fetch origin'),
		geekExecuteCommand('git checkout geek-config'),
		copyJsonFile(path.join(process.cwd(), "geek-config.json"), path.join(process.cwd(), "geek.json")),
		geekExecuteCommand('git checkout master'),
	]).then((res) => {
		console.log('Success')
	}).catch((err) => {
		console.log(err, '............err')
	})
}

let promiseWaterfall = (arr) => {
	let ret = Promise.resolve(null);
	let res = [];
	return arr.reduce((result, item, index) => {
		return result.then((value) => {
			value
			return item(value).then((val) => {
				val
				return val;
			})
		})
	}, ret)
}

let geekNext = () => {
	// why waterfall?
	// because we need res - config json for every next operation
	promiseWaterfall([
		readJsonFile(path.join(process.cwd(), "geek.json")),
	]).then((res) => {
		console.log(res, "res", res.branches)
		// git get currrent branch name only
		geekExecuteCommand('git rev-parse --abbrev-ref HEAD')().then((branchName) => {
			let index = res.branches.indexOf(branchName.trim())
			let branch = index != -1 ?
				res.branches[index + 1] :
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

let geekPrevious = () => {
	// why waterfall?
	// because we need res - config json for every next operation
	promiseWaterfall([
		readJsonFile(path.join(process.cwd(), "geek.json")),
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

let geekJumpTo = (branchName) => {
	// why waterfall?
	// because we need res - config json for every next operation
	promiseWaterfall([
		readJsonFile(path.join(process.cwd(), "/geek.json")),
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

let geekReset = () => {
	promiseWaterfall([
		readJsonFile(path.join(process.cwd(), "/geek.json")),
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
	promiseWaterfall([
		readJsonFile(path.join(process.cwd(), "/geek.json")),
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
	"updateJsonFile": updateJsonFile,
	"readJsonFile": readJsonFile,
	"geekExecuteCommand": geekExecuteCommand
};

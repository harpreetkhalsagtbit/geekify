var fs = require("fs");
var exec = require('child_process').exec;
var colors = require('colors/safe');

function execute(command, callback) {
	exec(command, function(error, stdout, stderr) {
		callback(error, stdout, stderr);
	});
}

function printLibName() {
	console.log(colors.green("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*"));
	console.log(colors.green("*                                                     *"));
	console.log(colors.green("*    ***    ****   ****   *   *  *****  ****  *   *   *"));
	console.log(colors.green("*   *       *      *      * *      *    *      * *    *"));
	console.log(colors.green("*   *  ***  ***    ***    **       *    ***     *     *"));
	console.log(colors.green("*   *   *   *      *      * *      *    *       *     *"));
	console.log(colors.green("*    ****   ****   ****   *   *  *****  *       *     *"));
	console.log(colors.green("*                                                     *"));
	console.log(colors.green("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*"));
}
function geekPerformInitActionX() {
	return new Promise(function(fulfill, reject) {
		geekExecuteCommand('git checkout geek-config').then(function(response) {
			readJsonFile(process.cwd() + "/geek-config.json").then(function(configJson) {
				geekExecuteCommand('git checkout master').then(function(response) {
					updateJsonFile(process.cwd() + "/geek.json", JSON.stringify(configJson, null, 4)).then(function(response) {
						readJsonFile(process.cwd() + "/geek.json").then(function(response) {
							console.log(response)
							var json = response;
							json.index = parseInt(json.initialBranchIndex) || 0
							var _step = json.branches[json.initialBranchIndex];
							console.log("_step", _step)
							if(_step) {
								geekExecuteCommand('git checkout ' + _step).then(function(response) {
									updateJsonFile(process.cwd() + "/geek.json", JSON.stringify(json, null, 4)).then(function(response) {
										if(_step && _step.message) {
											console.log(colors.green(_step.message.join("\n")));
											fulfill();
										}
										fulfill();
									}, function(err) {
										console.error("updateJsonFile: ", err)
									}).catch(function(err) {
										console.log(err.stack);
									});
								}, function(err) {
									console.error("geekExecuteCommand: ", err)
								}).catch(function(err) {
									console.log(err.stack);
								});
							}

							if(_step && _step.message) {
								console.log(colors.green(_step.message.join("\n")));
								fulfill();
							}
						}, function(err) {
							console.error("readJsonFile: ", err)
						}).catch(function(err) {
							console.log(err.stack);
						});
					}, function(err) {
						console.error("updateJsonFile: ", err)
					}).catch(function(err) {
						console.log(err.stack);
					});
				}, function(err) {
					console.error("geekExecuteCommand: ", err)
				}).catch(function(err) {
					console.log(err.stack);
				});

			}, function(err) {
				console.error("geekExecuteCommand: ", err)
			}).catch(function(err) {
				console.log(err.stack);
			});

		}, function(err) {
			console.error("geekExecuteCommand: ", err)
		}).catch(function(err) {
			console.log(err.stack);
		});
	});
}

function geekPerformResetAction() {
	return new Promise(function(fulfill, reject) {
		readJsonFile(process.cwd() + "/geek.json").then(function(response) {
			var json = response;
			json.index = 0
			var _step = json.branches[json.initialBranchIndex];
			if(_step) {
				geekExecuteCommand('git checkout ' + _step).then(function(response) {
					updateJsonFile(process.cwd() + "/geek.json", JSON.stringify(json, null, 4)).then(function(response) {
						if(_step && _step.message) {
							console.log(colors.green(_step.message.join("\n")));
							fulfill();
						}
						fulfill();
					}, function(err) {
						console.error("updateJsonFile: ", err)
					}).catch(function(err) {
						console.log(err.stack);
					});
				}, function(err) {
					console.error("geekExecuteCommand: ", err)
				}).catch(function(err) {
					console.log(err.stack);
				});
			}

			if(_step && _step.message) {
				console.log(colors.green(_step.message.join("\n")));
				fulfill();
			}
		}, function(err) {
			console.error("readJsonFile: ", err)
		}).catch(function(err) {
			console.log(err.stack);
		});
	});
}

function geekPerformNextAction() {
	return new Promise(function(fulfill, reject) {
		readJsonFile(process.cwd() + "/geek.json").then(function(response) {
			var json = response;
			json.index = parseInt(json.index)
			if (json.index + 1 < json.branches.length) {
				json.index++;
				var _step = json.branches[json.index]
				if(_step) {
					geekExecuteCommand('git checkout ' + _step).then(function(response) {
						updateJsonFile(process.cwd() + "/geek.json", JSON.stringify(json, null, 4)).then(function(response) {
							if(_step && _step.message) {
								console.log(colors.green(_step.message.join("\n")));
								fulfill();
							}
							fulfill();
						}, function(err) {
							console.error("updateJsonFile: ", err)
						}).catch(function(err) {
							console.log(err.stack);
						});
					}, function(err) {
						console.error("geekExecuteCommand: ", err)
					}).catch(function(err) {
						console.log(err.stack);
					});
				}

				if(_step && _step.message) {
					console.log(colors.green(_step.message.join("\n")));
					fulfill();
				}
			} else {
				reject(new Error("Unable to move Next..."))
			}
		}, function(err) {
			console.error("readJsonFile: ", err)
		}).catch(function(err) {
			console.log(err.stack);
		});
	});
}

function geekPerformPreviousAction() {
	return new Promise(function(fulfill, reject) {
		readJsonFile(process.cwd() + "/geek.json").then(function(response) {
			var json = response;
			json.index = parseInt(json.index)
			if (json.index > 0) {
				json.index--;
				var _step = json.branches[json.index]
				if(_step) {
					geekExecuteCommand('git checkout ' + _step).then(function(response) {
						updateJsonFile(process.cwd() + "/geek.json", JSON.stringify(json, null, 4)).then(function(response) {
							if(_step && _step.message) {
								console.log(colors.green(_step.message.join("\n")))
								fulfill();
							}
							fulfill();
						}, function(err) {
							console.error("updateJsonFile: ", err)
						}).catch(function(err) {
							console.log(err.stack);
						});
					}, function(err) {
						console.error("geekExecuteCommand: ", err)
					}).catch(function(err) {
						console.log(err.stack);
					});
				}

				if(_step && _step.message) {
					console.log(colors.green(_step.message.join("\n")))
					fulfill();
				}
			} else {
				reject(new Error("Unable to move Next..."))
			}
		}, function(err) {
			console.error("readJsonFile: ", err)
		}).catch(function(err) {
			console.log(err.stack);
		});
	});
}

function geekPerformShowDiffAction() {
	return new Promise(function(fulfill, reject) {
		readJsonFile(process.cwd() + "/geek.json").then(function(response) {
			var json = response;
			json.index = parseInt(json.index)
			console.log("json.index", json.index)
			if (json.index > 0) {
				var _start = json.branches[json.index - 1];
				var _end = json.branches[json.index];
				geekExecuteCommand('git diff ' + _start + " " + _end).then(function(response) {
					console.log("Diff done")
				}, function(err) {
					console.error("geekExecuteCommand: ", err)
				}).catch(function(err) {
					console.log(err.stack);
				});
			} else {
				reject(new Error("No diff to show..."))
			}
		}, function(err) {
			console.error("readJsonFile: ", err)
		}).catch(function(err) {
			console.log(err.stack);
		});
	});
}

function updateJsonFile(fileName, json) {
	return new Promise(function(fulfill, reject) {
		fs.writeFile(fileName, json, function(err, data) {
			if (err) reject(err);
			else {
				fulfill();
			}
		});
	});
}


/**
 * Utility function for executing promises in series, helping
 * writing clean code.
 *
 * @param {Array} arr 
 * @returns Promise
 */
let promiseSeries = (arr = []) => {
	let ret = Promise.resolve(null);
	// let res = [];
	return arr.reduce((result, item, index) => {
		return result.then((value) => {
			return item(index).then((val) => {
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
		return new Promise(function(resolve, reject) {
			execute(command, function(err, stdout, stderr) {
				if (err) reject(err);
				else {
					if (stdout) {
						console.log('Program stdout:', colors.green(stdout));
					} else if (stderr) {
						console.log('Program stderr:', colors.red(stderr));
					}
					resolve();
				}
			});
		});
	}
}

let readJsonFile = (fileName) => {
	return () => {
		return new Promise(function(resolve, reject) {
			fs.readFile(fileName, function(err, data) {
				if (err) reject(err);
				else {
					console.log(data.toString())
					resolve(JSON.parse(data.toString()))
				}
			});
		});
	}
}

function updateJsonFile(fileName, json) {
	return () => {
		return new Promise(function(fulfill, reject) {
			fs.writeFile(fileName, json, function(err, data) {
				if (err) reject(err);
				else {
					fulfill();
				}
			});
		});
	}
}

let geekPerformInitAction = () => {
	let queue = [
		geekExecuteCommand('git checkout geek-config'),
		readJsonFile(process.cwd() + "/geek-config.json")
	]
	return promiseSeries(queue);
}

// let queue = [geekExecuteCommand('cd ../ && ls'), geekExecuteCommand('cd ../ && ls -a'), geekExecuteCommand()]
// let res = promiseSeries(queue).then((val) => {
// 	console.log(val, 'val')
// })

// console.log(geektest('ls')());



module.exports = {
	"execute": execute,
	"printLibName": printLibName,
	"geekPerformInitAction": geekPerformInitAction,
	"geekPerformResetAction": geekPerformResetAction,
	"geekPerformNextAction": geekPerformNextAction,
	"geekPerformPreviousAction": geekPerformPreviousAction,
	"geekPerformShowDiffAction": geekPerformShowDiffAction,
	"updateJsonFile": updateJsonFile,
	"readJsonFile": readJsonFile,
	"geekExecuteCommand": geekExecuteCommand
};


var figlet = require('figlet');
 
figlet('Geekify', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});

let geekInit = () => {
	let ignoreText = "node_modues\ngeek.json"
	let configJson = {
		"branches": [],
	}

	let queue = [
		geekExecuteCommand('git init'),
		updateJsonFile(process.cwd() + "/.gitignore", ignoreText),
		geekExecuteCommand('git add .gitignore && git commit -m "Add: initial commit - ignore geek.json file"'),
		geekExecuteCommand('git checkout -b geek-config'),
		updateJsonFile(process.cwd() + "/geek.json", JSON.stringify(configJson, null, 4)),
		geekExecuteCommand('git checkout master'),
	]
	return promiseSeries(queue);
}

// there would be only one file geek.json
// earlier we were using geek-config and geek.json as separate file
// when we were modifying geek.json file for every operation to keep
// track of the tute, now we will be using diff method
geekInit();
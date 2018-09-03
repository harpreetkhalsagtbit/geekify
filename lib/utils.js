const fs = require("fs");
const exec = require('child_process').exec;

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

let copyJsonFile = (source, target) => {
	return () => {
		return new Promise(function (resolve, reject) {
			fs.copyFile(source, target, (err) => {
				if (err) reject(err);
				else {
					resolve(true)
				}
			});
		});
	}
}


module.exports = {
	execute,
	copyJsonFile,
	PromiseSeries
}
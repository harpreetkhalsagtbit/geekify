const fs = require("fs");

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

const PromiseWaterfall = (arr) => {
    let ret = Promise.resolve('null');
    return arr.reduce((result, item, index) => {
        return result.then((value) => {
            return item(value).then((val) => {
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

let readJsonFile = (fileName) => {
	return new Promise(function (resolve, reject) {
		fs.readFile(fileName, function (err, data) {
			if (err) reject(err);
			else {
				resolve(JSON.parse(data.toString()))
			}
		});
	});
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

module.exports = {
	PromiseSeries,
	copyJsonFile,
	readJsonFile,
	PromiseWaterfall,
	updateJsonFile
}
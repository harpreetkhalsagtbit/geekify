const fs = require("fs");
const figlet = require('figlet');


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

let f1 = (param) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(['A', 'X'])
		}, 200)
	})
}

let f2 = ([param1, param2]) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('B' + param1 + param2)
		}, 200)
	})
}
let f3 = (param) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('C' + param)
		}, 200)
	})
}

let PromiseWaterfall = (arr) => {
    let ret = Promise.resolve('null');
    return arr.reduce((result, item, index) => {
        return result.then((value) => {
            return item(value).then((val) => {
                return val;
            })
        })
    }, ret)
}
let arr = [f1, f2, f3]
PromiseWaterfall(arr).then((res) => {
	res
})

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

module.exports = {
	PromiseSeries,
	copyJsonFile,
	readJsonFile,
	PromiseWaterfall,
	updateJsonFile,
	printTitle
}
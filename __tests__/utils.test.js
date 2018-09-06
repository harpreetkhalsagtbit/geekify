const utils = require("../lib/utils");

let asyncFunSeries = (param) => {
    return () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(param);
            }, 200)
        });
    }
}

let asyncFuncWaterfall = (param) => {
    return () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let res = 10;
                resolve(param || res);
            }, 200)
        });
    }
}


test('Utils Promise Series Function', (done) => {
    function callback(res) {
        expect(res).toBe(40);
        done();
    }
    let arr = [asyncFunSeries(10), asyncFunSeries(20), asyncFunSeries(30), asyncFunSeries(40)];
    utils.PromiseSeries(arr).then(callback)
});

test('Utils Promise Waterfall Function', (done) => {
        
    function callback(res) {
        expect(res).toBe(40);
        done();
    }    
    let arr = [asyncFuncWaterfall(10), asyncFuncWaterfall(20), asyncFuncWaterfall(), asyncFuncWaterfall(40)];
    utils.PromiseWaterfall(arr).then(callback)
});



/* 
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
 */
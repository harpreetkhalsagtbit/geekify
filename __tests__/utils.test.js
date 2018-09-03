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
    let arr = [asyncFuncWaterfall(10), asyncFuncWaterfall(20), asyncFuncWaterfall(30), asyncFuncWaterfall(40)];
    utils.PromiseWaterfall(arr).then(callback)
});


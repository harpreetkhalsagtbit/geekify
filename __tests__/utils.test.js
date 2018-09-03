const utils = require("../lib/utils");

// test('Utils Execute Command Function - execute', (done) => {
//     function callback(error, stdout, stderr) {
//         expect(error).toBe(null);
//         expect(stdout).not.toBeNull();
//         expect(stderr).toBe('');
//         done();
//     }

//     utils.execute('ls -a', callback)
// });


test('Utils Promise Series Function', (done) => {
    function callback(res) {
        expect(res).toBe(40);
        done();
    }

    let f1 = (param) => {
        return () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(param);
                }, 200)
            });
        }
    }

    let f2 = (param) => {
        return () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(param);
                }, 200)
            });
        }
    }

    let f3 = (param) => {
        return () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(param);
                }, 200)
            });
        }
    }

    let f4 = (param) => {
        return () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(param);
                }, 200)
            });
        }
    }

    
    utils.PromiseSeries([f1(10), f2(20), f3(30), f4(40)]).then(callback)

});

// test('CopyJSONFile Function - execute', (done) => {

//     function callback(res) {
//         expect(res).toBe(true);
//         done();
//     }

//     utils.copyJsonFile('copy.me', 'paste.me')().then(callback)
// });

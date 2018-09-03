const util = require("../lib/utils");
const geekHandler = require("../lib/handlers");

test('GeekExecuteCommand Function - execute', (done) => {
    function callback(stdout) {
        expect(stdout).not.toBeNull();
        done();
    }

    geekHandler.geekExecuteCommand('ls -a')().then(callback)
});


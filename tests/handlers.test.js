const geekHandler = require("../lib/handlers");

test('Execute Command Function - execute', (done) => {
    function callback(error, stdout, stderr) {
        expect(error).toBe(null);
        expect(stdout).not.toBeNull();
        expect(stderr).toBe('');
        done();
    }

    geekHandler.execute('ls -a', callback)
});

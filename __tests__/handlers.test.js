const geekHandler = require("../lib/handlers");
jest.mock('../lib/handlers');

test('GeekExecuteCommand Function - execute', (done) => {

    const resp = 'some';
    geekHandler.geekExecuteCommand.mockResolvedValue(resp);

    geekHandler.geekExecuteCommand('ls -a').then((res) => {
        expect(res).not.toBeNull();
        done();
    })
});

test('CopyJSONFile Function - execute', (done) => {
    const resp = true;
    geekHandler.copyJsonFile.mockResolvedValue(resp);

    geekHandler.copyJsonFile('copy.me', 'paste.me').then((res => {
        expect(res).toBe(true);
        done();
    }))
});

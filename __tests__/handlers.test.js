const handlers = require("../lib/handlers");

test('Geek Execute Command Function', (done) => {
    handlers.geekExecuteCommand().then((res) => {
        expect(res).not.toBe(null)
        done();
    })
})

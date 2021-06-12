import Server from '../src/Server';

describe('Server', () => {

    it('.constructor()', done => {

        const server = new Server();

        expect(server).toBeInstanceOf(Server);

        server.stop().then(done);
    });
});
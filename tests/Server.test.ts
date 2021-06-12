import Server from '../src/Server';

describe('Server', () => {

    describe('.constructor()', () => {

        it('.constructor()', done => {

            const server = new Server();
    
            expect(server).toBeInstanceOf(Server);
    
            server.stop().then(done);
        });
    })
    
    describe('.registerExtension()', () => {

        it('should register an extension inside the server', done => {

            const server = new Server();

            expect(server.extensions).toHaveLength(0);

            server.registerExtension({
                name: 'test',
                version: 1
            });

            expect(server.extensions).toHaveLength(1);

            server.stop().then(done);
        });
    });
});
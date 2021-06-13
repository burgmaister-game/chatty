import Server from '../src/Server';

describe('Server', () => {

    describe('.constructor()', () => {

        it('.constructor()', async () => {

            const server = new Server({ port: 8001 });

            expect(server).toBeInstanceOf(Server);

            await server.stop();
        });
    })
    
    describe('.registerExtension()', () => {

        it('should register an extension inside the server', async () => {

            const server = new Server({ port: 8002 })

            expect(server.extensions).toHaveLength(0);

            server.registerExtension({
                name: 'test',
                version: 1
            });

            expect(server.extensions).toHaveLength(1);

            await server.stop();
        });
    });

    describe('.stop()', () => {

        it('should stop the server', () => {


        });
    });
});
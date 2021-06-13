import Server from '../src/Server';
import RestEndpoint from '../src/RestEndpoint';
import HttpRequest from '../src/HttpRequest';
import RestResult from '../src/RestResult';

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

        it('should registr rest endpoints', async () => {

            const server = new Server({ port: 8003 });

            server.registerExtension({
                name: 'test',
                version: 1,
                restEndpoints: [
                    new class extends RestEndpoint {

                        constructor() { super('GET', '/test'); }

                        handle(request:HttpRequest) : RestResult {
                            return new RestResult("OK");
                        }
                    }
                ]
            });

            const response = await server.server?.inject({
                method: "GET",
                url: "/test"
            });

            expect(response?.body).toEqual("OK");

            // await server.stop();
        });
    });

    describe('.stop()', () => {

        it('should stop the server', () => {


        });
    });
});
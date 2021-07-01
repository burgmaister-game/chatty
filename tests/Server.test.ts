import Server from '../src/Server';
import RestEndpoint from '../src/RestEndpoint';
import HttpRequest from '../src/HttpRequest';
import RestResult from '../src/RestResult';

describe('Server', () => {

    describe('.constructor()', () => {

        it('should construct a server', async () => {

            const server = new Server();

            expect(server).toBeInstanceOf(Server);

            await server.stop();
        });
    })
    
    describe('.registerExtension()', () => {

        it('should register an extension inside the server', async () => {

            const server = new Server()

            expect(server.extensions).toHaveLength(0);

            server.registerExtension({
                name: 'test',
                version: 1
            });

            expect(server.extensions).toHaveLength(1);

            await server.stop();
        });

        it('should register rest endpoints', async () => {

            const server = new Server();

            server.registerExtension({
                name: 'test',
                version: 1,
                restEndpoints: [
                    new class extends RestEndpoint {

                        constructor() { super('GET', '/test'); }

                        handle(request:HttpRequest) : RestResult {
                            return new RestResult(200, "OK");
                        }
                    }
                ]
            });

            const response = await server.server?.inject({
                method: "GET",
                url: "/test"
            });

            expect(response?.statusCode).toEqual(200);
            expect(response?.body).toEqual("OK");

            // await server.stop();
        });

        it('should make sure the response code from endpoint is passed', async () => {

            const server = new Server();

            server.registerExtension({
                name: 'test',
                version: 1,
                restEndpoints: [
                    new class extends RestEndpoint {

                        constructor() { super('GET', '/test'); }

                        handle(request:HttpRequest) : RestResult {
                            return new RestResult(400, "Bad");
                        }
                    }
                ]
            });

            const response = await server.server?.inject({
                method: "GET",
                url: "/test"
            });

            expect(response?.statusCode).toEqual(400);
            expect(response?.body).toEqual("Bad");
        });
    });

    // @note we don't test .listen() and .stop() cause testing these methods cause the whole jest
    // process to hang.
});
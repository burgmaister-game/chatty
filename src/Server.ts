import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { default as FastifyWebSocket, SocketStream } from 'fastify-websocket'
import Extension from "./Extension";
import RestEndpoint from './RestEndpoint';
import WebSocketEndpoint from './WebSocketEndpoint';
import FastifyHttpRequest from './FastifyHttpRequest';
/**
 *  This is a class responsible for creating a chatty server (get it? it's chatty :).
 *  An instance of this class will be instantiate in the app/client code and will
 *  be configured for various purposes.
 * 
 *  @todo   add a way to inject a logger
 *  @todo   add a way to inject a http server (cause maybe someone wants to reuse
 *          an existing one)
 *  @todo   add a way to configure port on which the server listens
 */
export default class Server {

    private _server:FastifyInstance | null = null;

    private readonly _extensions:Map<string, Extension> = new Map();

    constructor(props:ServerProps = { }) {

        this._server = Fastify({
            logger: props.logger || false,
            return503OnClosing: false
        });

        // make sure we have the websocket plugin registered. Otherwise w can't do any websocket
        // stuff with fastify and typescript doesn't want to work correnctly with it.
        this._server.register(FastifyWebSocket);
    }

    /**
     *  Get access to fastify instance. You shouldn't really use it without
     *  a good reason but it might be useful to get access to it.
     */
    public get server() : FastifyInstance|null { return this._server; }

    /**
     *  Get list of registered extensions.
     */
    get extensions() : Array<Extension> { return [...this._extensions.values()]; }

    /**
     *  Register an extension inside this server.
     */
    public registerExtension(extension:Extension) : this {

        // construct the extension id // @todo this needs to be a defined format/type
        const id = `${extension.name}::${extension.version}`;

        if (this._extensions.has(id)) return this;
        this._extensions.set(id, extension);

        if (extension.restEndpoints) for (let endpoint of extension.restEndpoints) this.registerRest(endpoint);
        if (extension.wsEndpoints) for (let endpoint of extension.wsEndpoints) this.registerWebSocket(endpoint);

        return this;
    }

    /**
     *  Make the server listen to a specific port.
     */
    public listen(port:number) : PromiseLike<void> {

        return new Promise((resolve, reject) => {

            if (!this._server) reject();
            else this._server?.listen(port).then(() => void resolve(), () => void reject());
        });
    }

    /**
     *  Stop the server. The promise resolves when the server is entirely stopped.
     */
    public stop() : PromiseLike<void> {

        if (!this._server) return Promise.resolve();

        return this._server.close().then(() => {

            this._server = null;
        });
    }

    /**
     *  Register a REST endpoint.
     */
    private registerRest(endpoint:RestEndpoint) : void {

        if (!this._server) return;

        this._server.route({
            method:     endpoint.method,
            url:        endpoint.path,
            handler:    (request:FastifyRequest, reply:FastifyReply) => {

                const result = endpoint.handle(new FastifyHttpRequest(request));

                // @todo is this correct?
                reply.send(result.payload);
            }
        })
  }

    private registerWebSocket(endpoint:WebSocketEndpoint) : void {

        if (!this._server) return;

        this._server.route({
            method:     endpoint.method,
            url:        endpoint.path,
            handler:    () => { },
            wsHandler:  (rawConnection:SocketStream, request:FastifyRequest) => {

                endpoint.handle(rawConnection, { });
            }
        });
    }
};

export interface ServerProps {
    logger?:boolean
};
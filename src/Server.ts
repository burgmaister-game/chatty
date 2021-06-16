import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { default as FastifyWebSocket } from 'fastify-websocket'
import Extension from "./Extension";
import RestEndpoint from './RestEndpoint';
import WebSocketEndpoint from './WebSocketEndpoint';
import FastifyHttpRequest from './FastifyHttpRequest';
import { resolve } from 'path/posix';
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

    constructor(props:ServerProps) {

        this._server = Fastify({
            logger: props.logger || true,
            return503OnClosing: false
        });

        // make sure we have the websocket plugin registered. Otherwise w can't do any websocket
        // stuff with fastify and typescript doesn't want to work correnctly with it.
        this._server.register(FastifyWebSocket);

        // @todo maybe we should make it a method and make sure that caller code can react
        // when we know that something can go wrong.
        this._server.listen(props.port || 80).catch(() => {

            if (!this._server) return;

            this._server.log.error(`Can't start a server on port ${props.port || 80}`);

            // @todo handle this properly cause now the information that the server
            // can't start is swallowed by logs. In reality we should make sure that the
            // process with a non-zero response. Otherwise, it will be a PITA to run
            // this inside a docker container or kubernetes.
        });
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

        // @todo
    }
};

export interface ServerProps {
    port?:number,
    logger?:boolean
};
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest, HTTPMethods } from 'fastify';
import { default as FastifyWebSocket } from 'fastify-websocket'
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
 * 
 *  @author     Paweł Kuźnik <pawel.kuznik@gmail.com>
 *  @critic     Tamara Bazko <tamara.bazko@gmail.com>
 */
export default class Server {

    private readonly _server:FastifyInstance;

    private readonly _extensions:Map<string, Extension> = new Map();

    constructor(logger:boolean = false) {

        this._server = Fastify({ logger });

        // make sure we have the websocket plugin registered. Otherwise w can't do any websocket
        // stuff with fastify and typescript doesn't want to work correnctly with it.
        this._server.register(FastifyWebSocket);

        // @todo make it configurable
        this._server.listen(8000).then().catch(() => {

            this._server.log.error("Can't start a server on port 8000");

            // @todo handle this properly cause now the information that the server
            // can't start is swallowed by logs. In reality we should make sure that the
            // process with a non-zero response. Otherwise, it will be a PITA to run
            // this inside a docker container or kubernetes.
        });
    }

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
     *  Stop the server. The promise resolves when the server is entirely stopped.
     */
    public stop() : Promise<undefined> {

        // so, TS is getting confused with union types that fastify returns.
        // When close is called without params it returns a promise and fastify
        // declares a Fastify and Promise union type. This should work, but
        // apparently the union is missing methods.
        return this._server.close().then(() => {

            // this will make sure that the node server really stops
            this._server.server.unref();

        }) as Promise<undefined>;
    }

    /**
     *  Register a REST endpoint.
     */
    private registerRest(endpoint:RestEndpoint) : void {

        this._server.route({
            method:     endpoint.method,
            url:        endpoint.path,
            handler:    (request:FastifyRequest, reply:FastifyReply) => {

                const result = endpoint.handle(new FastifyHttpRequest(request));

                // send the payload of the result
                // @todo is this correct?
                reply.send(result.payload);
            }
        })
  }

    private registerWebSocket(endpoint:WebSocketEndpoint) : void {

        // @todo
    }
};
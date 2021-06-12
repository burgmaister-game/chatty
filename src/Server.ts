import Fastify, { FastifyInstance, FastifyReply, FastifyRequest, HTTPMethods } from 'fastify';
import { default as FastifyWebSocket } from 'fastify-websocket'
import Extension from "./Extension";
import RestEndpoint from './RestEndpoint';
import WebSocketEndpoint from './WebSocketEndpoint';
/**
 *  This is a class responsible for creating a chatty server (get it? it's chatty :).
 *  An instance of this class will be instantiate in the app/client code and will
 *  be configured for various purposes.
 *  @author     Paweł Kuźnik <pawel.kuznik@gmail.com>
 *  @critic     Tamara Bazko <tamara.bazko@gmail.com>
 */
export default class Server {

    private _server:FastifyInstance = Fastify({ logger: true });

    private _extensions:Map<string, Extension> = new Map();

    constructor() {

        // make sure we have the websocket plugin registered. Otherwise w can't do any websocket
        // stuff with fastify and typescript doesn't want to work correnctly with it.
        this._server.register(FastifyWebSocket);

        // @todo make it configurable
        this._server.listen(8000);
    }

    /**
     *  Get list of registered extensions.
     */
    get extensions() : Array<Extension> { return []; }

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
     *  Register a rest endpoint.
     */
    private registerRest(endpoint:RestEndpoint) : void {

        this._server.route({
            // @todo should we have our equivalent type? instead of trusting our code and
            // treating it as a Fastify HTTPMethod?
            method:     endpoint.method as HTTPMethods,
            url:        endpoint.path,
            handler:    (request:FastifyRequest, reply:FastifyReply) => {

                // @todo pass params somehow
                const result = endpoint.handle({ });

                // send the payload of the result
                reply.send(result.payload);
            }
        })

        // @todo
    }

    private registerWebSocket(endpoint:WebSocketEndpoint) : void {

        // @todo
    }
};
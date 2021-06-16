import { SocketStream } from 'fastify-websocket';
import { HttpMethod } from './HttpMethod';
import WebSocketConnection from './WebSocketConnection';

/**
 *  This is a base class for all websocket endpoints. A WS endpoint is a script that
 *  handles a new WS connection and creates a proper connection.
 */
export default abstract class WebSocketEndpoint {

    private _path:string;

    /**
     *  We set the method as GET cause our current http server seems
     *  to require GET as the method for websocket connections. It makes
     *  little sense, but we will roll with it.
     */
    private _method:HttpMethod = 'GET';

    /**
     *  The constructor for the actual WebSocket connection.
     */
    private _Connection:typeof WebSocketConnection;

    constructor(path:string, Connection: typeof WebSocketConnection) {

        this._path = path;
        this._Connection = Connection;
    }

    /**
     *  Public accessors to properties.
     */
    get method() : HttpMethod { return this._method; }
    get path() : string { return this._path; }

    /**
     *  This method is called when a new websocket connection is establish
     *  and the server needs to handle the initial state. The resulting instance
     *  is the actual living connection and it should hold logic about the
     *  protocol used in this connection.
     */
    handle(stream:SocketStream, params:object) : WebSocketConnection
    {
        // construct the connection
        return new this._Connection(stream, params);
    }
};
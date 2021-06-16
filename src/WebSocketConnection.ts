import { SocketStream } from "fastify-websocket";
import { Emitter } from "iventy";
/**
 *  This is a class wrapping a socket connection for us. 
 */
export default class WebSocketConnection extends Emitter {

    private _stream:SocketStream;

    constructor(stream:SocketStream, params:object) {

        super();

        this._stream = stream;

        this.onConnect();

        this._stream.socket.on('message', (data:string) => void this.onMessage(data));
    }

    /**
     *  Send data to the client.
     */
    protected send(message:string) {

        this._stream.socket.send(message);
    }

    /**
     *  A special 'hook' method to react to when a connection is established.
     */
    protected onConnect() {

        // no implementation, this is expected to be implemented in the derived class,
        // but it can't be declared abstract cause deriving class might want to not
        // implement this method.
    }

    /** 
     *  A special 'hook' method to react when a new message from client occurs
     *  on the connection.
     */
    protected onMessage(message:string) {

        // no implementation, this is expected to be implemented in the derived class,
        // but it can't be declared abstract cause deriving class might want to not
        // implement this method.
    }

    /**
     *  A special 'hook' method to read when the connection is closed.
     * 
     *  @todo should this be only called when the connection is closed by the client
     *  or should it be also called when the connection is closed server-side?
     */
    protected onClose() {

        this.trigger('close');
    }

    /**
     *  Close the connection.
     */
    public close() {

        // close the socket connection of the stream. Normally, we would call stream
        // .end() to end the stream, but the stream is not the source of the data,
        // the socket property is an the stream is the method of piping data to us.
        // The socket property is the actual raw connection that we want to close.
        // @todo should we add close code and explanation?
        this._stream.socket.close();
    }
};
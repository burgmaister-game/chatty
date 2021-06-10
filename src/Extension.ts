import RestEndpoint from './RestEndpoint';
import WebSocketEndpoint from './WebSocketEndpoint';
/**
 *  This is an interface describing an object that needs to be provided to
 *  the server to register a specific extension. This extension has to provide
 *  a name and version. Combination of both needs to be unique for the whole
 *  server.
 * 
 *  Optionally, the extension has to provide definitions for REST and WebSocket
 *  endpoints. Of course, the extension doesn't have to provide either, but
 *  it would be a quite useless extension.
 */
export default interface Extension {

    /**
     *  The name of the extension. For a best practice it's better to keep it
     *  a alphanumeric string with '-' as word separators.
     */
    name: string;

    /**
     *  The version of the extension. This should be only integer numbers
     *  that indicate to the client about supported extension version.
     */
    version: number;

    /**
     *  The possible REST endpoints the extension needs to install inside
     *  the server.
     */
    restEndpoints?:Array<RestEndpoint>;

    /**
     *  The possible WebSocket endpoints the extension needs to install
     *  inside the server.
     */
    wsEndpoints?:Array<WebSocketEndpoint>;
};

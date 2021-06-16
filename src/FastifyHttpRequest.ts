import { FastifyRequest } from "fastify";
import HttpRequest, { QueryStringObject } from './HttpRequest';
import { HttpMethod } from './HttpMethod';
/**
 *  This is a class wrapping around a fastify request inside our (smaller)
 *  interface. This way we can make the library smaller and minimize 
 *  client code exposure to our dependencies. 
 */
export default class FastifyHttpRequest implements HttpRequest {

    private readonly _original:FastifyRequest;

    constructor(orignal:FastifyRequest) {

        this._original = orignal;
    }
    
    // @todo implement me
    get queryString(): QueryStringObject { return Object.assign({ }, this._original.query); }
    get method() : HttpMethod { return 'GET'; }

    /**
     *  Get access to the origianl FastifyRequest object. Interacting with
     *  this object is discouraged cause the implementation of the original
     *  request might change in the future.
     */
    get original() : FastifyRequest { return this._original; }
};
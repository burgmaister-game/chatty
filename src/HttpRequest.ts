import { FastifyRequest } from "fastify";
import { HttpMethod } from './HttpMethod';


export interface QueryStringObject {
    [ key: string ] : string|undefined;
};
export default interface HttpRequest {

    /**
     *  Get access to the origianl FastifyRequest object. Interacting with
     *  this object is discouraged cause the implementation of the original
     *  request might change in the future.
     */
    original: FastifyRequest;

    /**
     *  The regular properties of a Http request.
     */
    queryString: QueryStringObject;
    method:HttpMethod;
};

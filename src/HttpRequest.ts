import { FastifyRequest, HTTPMethods } from "fastify";


export interface QueryStringObject {
    [ key: string ] : string|undefined;
};

export type HTTPMethod = HTTPMethods;

export default interface HttpRequest {

    /**
     *  Get access to the origianl FastifyRequest object. Interacting with
     *  this object is discouraged cause the implementation of the original
     *  request might change in the future.
     */
    original: FastifyRequest;

    queryString: QueryStringObject;

    method:HTTPMethod;
};

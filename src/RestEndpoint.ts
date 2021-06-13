import HttpRequest from "./HttpRequest";
import RestResult from "./RestResult";
import { HttpMethod } from "./HttpMethod";
/**
 *  This is a base class for all REST endpoints. An endpoint invokes
 *  when the server recognizes a specific path on a specific method.
 * 
 *  @author     Paweł Kuźnik <pawel.kuznik@gmail.com>
 */
export default abstract class RestEndpoint {

    private _method:HttpMethod;
    private _path:string;

    public constructor(method:HttpMethod, path:string) {

        this._method = method;
        this._path = path;
    }

    /**
     *  Public accessors to properties.
     */
    public get method() : HttpMethod { return this._method; }
    public get path() : string { return this._path; }

    /**
     *  This is a method thant needs the be implemented in the child class to provide
     *  actual logic for handling REST endpoints. As a result we expect a RestResponse
     *  instance with information about the content of the respose that needs to be
     *  send to the client.
     */
    public abstract handle(request:HttpRequest) : RestResult;
};
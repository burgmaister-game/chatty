/**
 *  This is a class representing a REST request result.
 */
export default class RestResult {

    /**
     *  The HTTP code of the result.
     */
    private _code:number;

    /**
     *  The payload of the request.
     */
    private _payload:any;

    /**
     *  The constructor.
     */
    constructor(code:number, payload:any = undefined) {

        this._code = code;
        this._payload = payload;
    }

    /**
     *  The properties.
     */
    get code(): number { return this._code; }
    get payload() : any { return this._payload; }
    get contentType() : string { return 'application/json'; }
};
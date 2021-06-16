/**
 *  This is a class representing a REST request result.
 */
export default class RestResult {

    private _payload:any;

    constructor(payload:any = undefined) {
        this._payload = payload;
    }

    get payload() : any { return this._payload; }
    get contentType() : string { return 'application/json'; }
};
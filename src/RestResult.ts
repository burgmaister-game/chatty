export default class RestResult {

    private _payload:any;

    constructor(payload:any) {
        this._payload = payload;
    }

    get payload() : any { return this._payload; }
    get contentType() : string { return 'application/json'; }
};
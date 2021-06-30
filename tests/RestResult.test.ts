import RestResult from '../src/RestResult';

describe('RestResult', () => {

    describe('.constructor()', () => {

        it('should create a result', () => {

            expect(new RestResult()).toBeInstanceOf(RestResult);
        });
    });

    describe('.payload', () => {

        it('should be populated with constructor data', () => {

            expect(new RestResult('test').payload).toEqual('test');
        });
    });

    describe('.contentType', () => {

        it('should respond with json content type by default', () => {

            expect(new RestResult().contentType).toEqual('application/json');
        });
    });
});
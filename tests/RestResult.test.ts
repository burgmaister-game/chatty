import RestResult from '../src/RestResult';

describe('RestResult', () => {

    describe('.constructor()', () => {

        it('should create a result', () => {

            expect(new RestResult(200)).toBeInstanceOf(RestResult);
        });
    });

    describe('.code', () => {

        it('should assign the passed number', () => {

            expect(new RestResult(200).code).toEqual(200);
            expect(new RestResult(303).code).toEqual(303);
        });
    });

    describe('.payload', () => {

        it('should be populated with constructor data', () => {

            expect(new RestResult(200, 'test').payload).toEqual('test');
        });
    });

    describe('.contentType', () => {

        it('should respond with json content type by default', () => {

            expect(new RestResult(200).contentType).toEqual('application/json');
        });
    });
});
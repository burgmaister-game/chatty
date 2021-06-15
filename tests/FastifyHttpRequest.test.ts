import Fasitify, { FastifyRequest } from 'fastify';
import FastifyHttpRequest from "../src/FastifyHttpRequest";

describe('FastifyHttpRequest', () => {

    describe('.constructor()', () => {

        it ('should construct a reqeust', done => {

            const f = Fasitify();
            f.route({
                method: 'GET',
                url: '/',
                handler: (request:FastifyRequest) => {

                    const r = new FastifyHttpRequest(request);

                    expect(r).toBeInstanceOf(FastifyHttpRequest);

                    done();
                }
            });

            f.inject({
                method: 'GET',
                url: '/'
            });
        });
    });
});
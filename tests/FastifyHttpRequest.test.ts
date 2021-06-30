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

    describe('.queryString', () => {

        it ('should be populated', done => {

            const f = Fasitify();
            f.route({
                method: 'GET',
                url: '/',
                handler: (request:FastifyRequest) => {

                    const r = new FastifyHttpRequest(request);

                    expect(r.queryString).toEqual({ a: '123' });

                    done();
                }
            });

            f.inject({
                method: 'GET',
                url: '/',
                query: { a: '123' }
            });
        });
    });

    describe('.method', () => {

        it ('should be populated', done => {

            const f = Fasitify();
            f.route({
                method: 'GET',
                url: '/',
                handler: (request:FastifyRequest) => {

                    const r = new FastifyHttpRequest(request);

                    expect(r.method).toEqual('GET');

                    done();
                }
            });

            f.inject({
                method: 'GET',
                url: '/',
            });
        });
    });

    describe('.original', () => {

        it ('should expose the original reqeust', done => {

            const f = Fasitify();
            f.route({
                method: 'GET',
                url: '/',
                handler: (request:FastifyRequest) => {

                    const r = new FastifyHttpRequest(request);

                    expect(r.original).toEqual(request);

                    done();
                }
            });

            f.inject({
                method: 'GET',
                url: '/',
            });
        });
    });
});
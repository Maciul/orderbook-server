'use strict';

const onRequest = require( '../index.js' ).onRequest;
const routes = require( '../src/routes' );
const parseURL = require( 'url' ).parse;

describe( 'Testing Router', ()=>{
    let res;
    let req;

    beforeEach( ()=>{
        res = {};
        req = {};
        // mock out response methods
        res.writeHead = jest.fn();
        res.end = jest.fn();
        routes.getOrderBooks = jest.fn();
    } );

    it( 'should call res.end on healthcheck', () => {
        req.url = '/healthcheck';
        onRequest( req, res );
        expect( res.end ).toBeCalled();
    } );

    it( 'should return status 204 and end connection when route does not match', () => {
        req.url = '/';
        onRequest( req, res );
        expect( res.end ).toBeCalled();
        expect( res.statusCode ).toBe( 204 );
    } );

    it( 'should call getOrderBooks route', () => {
        req.url = '/getOrderBooks?market=ETH_BTC';
        const parsedUrl = parseURL( req.url, true );
        onRequest( req, res );
        expect( routes.getOrderBooks.mock.calls[0][0] ).toBe( req );
        expect( routes.getOrderBooks.mock.calls[0][1] ).toBe( res );
        expect( routes.getOrderBooks.mock.calls[0][2] ).toEqual( parsedUrl );
    } );
} );

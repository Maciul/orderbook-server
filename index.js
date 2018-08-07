'use strict';

const http = require( 'http' );
const routes = require( './src/routes' );
const c = require( './src/constants' );
const parseURL = require( 'url' ).parse;

module.exports.onRequest = ( req, res ) => {
    const url = parseURL( req.url, true );
    switch ( url.pathname ) {
        case '/healthcheck': {
            return res.end();
        }
        case '/getOrderBooks': {
            return routes.getOrderBooks( req, res, url );
        }
        case '/plotly': {
            return res.end();
        }
        default: {
            res.statusCode = 204;
            res.end();
        }
    }
};

this.server = http.createServer( this.onRequest );
this.server.listen( c.PORT );
console.log( `server running on ${c.PORT}` );

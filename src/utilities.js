'use strict';

const request = require( 'request' );

module.exports.promiseRequest = ( url ) => {
    return new Promise( function( resolve ) {
        request( url, function ( error, response, body ) {
            if ( error ) {
                return resolve( undefined );
            }
            try {
                resolve( JSON.parse( body ) );
            } catch ( e ) {
                resolve( undefined );
            }
        } );
    } );
};

module.exports.formatBittrexData = ( results ) => {
    // converts { Quantity: 12.052, Rate: 0.05469738 } --> [ rate, quantity ]
    const formattedData = results.map( order => {
        return [ order.Rate, order.Quantity ];
    } );
    return formattedData;
};

module.exports.isValidRequest = ( url ) => {
    const isString = function( element ) {
        return element && typeof element === 'string';
    };
    const currencyPair = url.query.market && url.query.market.split( '_' );

    return currencyPair && currencyPair.length === 2 && currencyPair.every( isString );
};

module.exports.sortBooks = ( orderBooks ) => {
    // just in case we want to sort the books before cumulating.
    for ( let book in orderBooks ) {
        if ( orderBooks[book].asks ) {
            orderBooks[book].asks.sort( ( a, b ) => {
                return a[0] - b[0];
            } );
        }
        if ( orderBooks[book].bids ) {
            orderBooks[book].bids.sort( ( a, b ) => {
                return b[0] - a[0];
            } );
        }
    }
};

module.exports.cumulateData = ( orderBooks ) => {
    for ( let book in orderBooks ) {
        orderBooks[book].asks.reduce( this.cumulateReduceFN, 0 );
        orderBooks[book].bids.reduce( this.cumulateReduceFN, 0 );
    }
};

module.exports.cumulateReduceFN = ( sum, order ) => {
    order[2] = sum + order[1];
    return sum + order[1];
};

module.exports.endConnection = ( res, orderBookToSend ) => {
    res.setHeader( 'Access-Control-Allow-Origin', '*' );
    res.end( JSON.stringify( orderBookToSend ) );
};

'use strict';

const utils = require( './utilities' );
const c = require( './constants' );

// Optout for Your Online Choices.
module.exports.getOrderBooks = async ( req, res, url ) => {
    if ( utils.isValidRequest( url ) === false ) {
        res.writeHead( 400, c.INVALID_REQUEST_ERROR );
        return res.end();
    }
    const currencyPair = url.query.market.split( '_' );
    const orderBookToSend = {
        bittrex: {},
        poloniex: {}
    };
    const results = await Promise.all( [
        utils.promiseRequest( c.BITTREX_URL + `${currencyPair[0]}-${currencyPair[1]}&type=both` ),
        utils.promiseRequest( c.POLONIEX_URL + `${currencyPair[0]}_${currencyPair[1]}&depth=100` )
    ] );

    if ( results ) {
        if ( results[0].success ) {
            orderBookToSend.bittrex.asks = utils.formatData( results[0].result.sell );
            orderBookToSend.bittrex.bids = utils.formatData( results[0].result.buy );
        }
        if ( !results[1].error ) {
            orderBookToSend.poloniex = results[1];
        }
    }
    utils.sortBooks( orderBookToSend );
    utils.cumulateData( orderBookToSend );
    utils.endConnection( res, orderBookToSend );
};

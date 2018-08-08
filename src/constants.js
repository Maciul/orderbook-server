'use strict';

const PORT = process.env.PORT || 8080;
const BITTREX_URL = 'https://bittrex.com/api/v1.1/public/getorderbook?market=';
const POLONIEX_URL = 'https://poloniex.com/public?command=returnOrderBook&currencyPair=';
const INVALID_REQUEST_ERROR = 'Invalid request. Check query ( getOrderBook?market=ETH_BTC )';

module.exports = {
    PORT,
    BITTREX_URL,
    POLONIEX_URL,
    INVALID_REQUEST_ERROR
};
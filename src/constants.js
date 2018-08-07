'use strict';

const PORT = 8002;
const BITTREX_URL = 'https://bittrex.com/api/v1.1/public/getorderbook?market='; // BTC-ETH&type=both
const POLONIEX_URL = 'https://poloniex.com/public?command=returnOrderBook&currencyPair='; // BTC_ETH&depth=10
const INVALID_REQUEST_ERROR = 'Invalid request, is your market query correct? ex. getOrder?market=ETH_BTC';

module.exports = {
    PORT,
    BITTREX_URL,
    POLONIEX_URL,
    INVALID_REQUEST_ERROR
};
### Crypto Fun: OrderBook Server 

*What does this service do?*
- The service will take in a currency pair. ( Currently supported pairs: BTH_ETH, BTC_DOGE, BTC_LTC )
- Obtain order book data from mutliple exchanges ( Currently supported: Bittrex and Poloniex )
- Format the data: 
    [ [ Rate, Quantity, Cumulated Qty ] ]
- Return data to client.

*How to use it?* 
- Make a request to http://heroku.com/getOrderBooks?market=${Supported Currency Pair}

*Have Fun!*

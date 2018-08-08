### Crypto Fun: OrderBook Server 

*What does this service do?*
- The service will take in a currency pair. ( Currently supported pairs: BTH_ETH, BTC_DOGE, BTC_LTC )
- Obtain order book data from mutliple exchanges ( Currently supported: Bittrex and Poloniex )
- Format the data
- Return data to client.

*How to use it?* 
- Make a request to https://sheltered-cove-26373.herokuapp.com/getOrderBooks?market= ${Supported Currency Pair}

- API Returns 
```json 
{
    "exchange1": {
        "asks": [
            [ "Rate", "Quantity", "Cumulated Quantity" ],
            ...
              ],
        "bids": [ 
            [ "Rate", "Quantity", "Cumulated Quantity" ],
            ...
            ]
    },
    "exchange2": {} ...
}
```

*Have Fun!*

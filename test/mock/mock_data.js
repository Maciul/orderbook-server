'use strict';

const sampleBittrexData = [
    { Quantity: 6.12867625, Rate: 0.05599 },
    { Quantity: 0.1562583, Rate: 0.05603696 },
    { Quantity: 14.503, Rate: 0.05603764 }
];

const sampleOrderBook = {
    bittrex: {
        asks: [
            [ 1, 1 ],
            [ 5, 5 ],
            [ 4, 4 ]
        ],
        bids: [
            [ 1, 2 ],
            [ 17, 3 ],
            [ 9, 1 ]
        ]
    },
    poloniex: {
        asks: [
            [ 1, 1 ],
            [ 8, 5 ],
            [ 4, 4 ],
        ],
        bids: [
            [ 2, 2 ],
            [ 13, 3 ],
            [ 10, 1 ],
        ]
    }
};

module.exports = {
    sampleBittrexData,
    sampleOrderBook
};
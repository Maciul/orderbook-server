'use strict';

const utils = require( '../src/utilities' );
const mockData = require( './mock/mock_data' );

describe( 'Utilities tests', ()=>{
    let res;
    const url = {
        query: {}
    };

    beforeEach( ()=>{
        res = {};
        // mock out response methods
        res.writeHead = jest.fn();
        res.setHeader = jest.fn();
        res.end = jest.fn();
    } );

    it( 'formatBittrexData: should format data from array of objects to array of arrays', () => {
        const formattedData = utils.formatBittrexData( mockData.sampleBittrexData );
        expect( formattedData ).toEqual( [
            [ 0.05599, 6.12867625 ],
            [ 0.05603696, 0.1562583 ],
            [ 0.05603764, 14.503 ] ] );
    } );

    it( 'isValidRequest: should return true if request is valid', () => {
        url.query.market = 'ETH_BTC';
        let result = utils.isValidRequest( url );
        expect( result ).toBeTruthy();
    } );

    it( 'isValidRequest: should return false if request is invalid', () => {
        url.query.market = 'ETH_';
        let result = utils.isValidRequest( url );
        expect( result ).toBeFalsy();
    } );

    it( 'sortBooks: should sort asks and bids arrays', () => {
        utils.sortBooks( mockData.sampleOrderBook );
        expect( mockData.sampleOrderBook.bittrex.asks ).toEqual( [ [ 1, 1 ], [ 4, 4 ], [ 5, 5 ] ] );
        expect( mockData.sampleOrderBook.poloniex.bids ).toEqual( [ [ 13, 3 ], [ 10, 1 ], [ 2, 2 ] ] );
    } );

    it( 'cumulateData: should add a 3rd value to array and cumulate data', () => {
        utils.cumulateData( mockData.sampleOrderBook );
        expect( mockData.sampleOrderBook.bittrex.asks.length ).toBe( 3 );
        expect( mockData.sampleOrderBook.bittrex.asks[0].length ).toBe( 3 );
        expect( mockData.sampleOrderBook.bittrex.asks ).toEqual( [ [ 1, 1, 1 ], [ 4, 4, 5 ], [ 5, 5, 10 ] ] );
        expect( mockData.sampleOrderBook.poloniex.bids ).toEqual( [ [ 13, 3, 3 ], [ 10, 1, 4 ], [ 2, 2, 6 ] ] );
    } );

    it( 'cumulateReduceFN: should add sum and second value from order array', () => {
        const order = [ 2, 5 ];
        const sum = 1;
        let result = utils.cumulateReduceFN( sum, order );
        expect( result ).toEqual( 6 );

    } );

    it( 'endConnection: should end connection and send data', () => {
        utils.endConnection( res, mockData.sampleOrderBook );
        expect( res.setHeader.mock.calls[0][0] ).toBe( 'Access-Control-Allow-Origin' );
        expect( res.setHeader.mock.calls[0][1] ).toBe( '*' );
        expect( res.end ).toBeCalled();
    } );
} );
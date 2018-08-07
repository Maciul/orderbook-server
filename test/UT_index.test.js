'use strict';

require( 'colors' );
jest.mock( '../src/constants.js' );
const onRequest = require( '../index.js' ).onRequest;
const parseURL = require( 'url' ).parse;
const c = require( '../src/constants.js' );
const utils = require( '../src/utilities.js' );

function getResponse( urlPath, req, res ) {
    req.url = urlPath;
    onRequest( req, res );
    res = {
        writeHead: res.writeHead.mock.calls[0],
        url: parseURL( res.writeHead.mock.calls[0][1].Location, true )
    };
    return res;
}

describe( 'Optout Server Tests', ()=>{
    let res;
    let req;
    let urlPath = '';
    let futureDate = new Date();
    futureDate.setTime( futureDate.getTime() + 3600 * 1000 * 43848 );

    beforeEach( ()=>{
        res = {};
        req = {
            headers: {
                cookie: 'sampleCookie=1',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
            },
        };
        urlPath = '';
        utils.YOCLog = jest.fn();
        // mock out response methods
        res.writeHead = jest.fn();
        res.end = jest.fn();
    } );

    describe( 'Testing functionality of GDPR requests'.magenta, () => {

        it( 'Should correctly set a 3rd party cookie', () => {
            req.url = urlPath = '/gdpr';
            onRequest( req, res );

            expect( res.writeHead.mock.calls[0][0] ).toBe( 200 );
            expect( res.writeHead.mock.calls[0][1]['Set-Cookie'] ).toEqual(
                'bxgraphGDPROptOut=1; expires=' + futureDate + '; domain=.cdnwidget.com; path=/' );
        } );
    } );

    describe( 'Testing functionality of NAI requests'.magenta, () => {

        it( 'Status Request: should redirect and include correct query', ()=>{
            urlPath = '/?action_id=3&participant_id=650&rd=http://optout.networkadvertising.org&noCache=1515514789879';
            res = getResponse( urlPath, req, res );

            expect( res.url.hostname ).toBe( c.OPTOUT_DOMAINS[0] );
            expect( res.writeHead[0] ).toBe( 302 );
            expect( res.url.query.count ).toBe( '0' );
            expect( res.url.query.domain ).toBe( 'augur.io' );
            expect( res.url.query.cs ).toBe( '' );
            expect( res.url.query.ncs ).toBe( '' );
        } );

        it( 'Optout Request: should redirect and include correct query params', ()=>{
            urlPath = '/?action_id=4&participant_id=650&rd=http://optout.networkadvertising.org&noCache=1515514789879';
            res = getResponse( urlPath, req, res );

            expect( res.url.hostname ).toBe( c.OPTOUT_DOMAINS[0] );
            expect( res.url.query.count ).toBe( '0' );
            expect( res.url.query.domain ).toBe( 'augur.io' );
            expect( res.url.query.cs ).toBe( '' );
            expect( res.url.query.ncs ).toBe( '' );
            expect( res.writeHead[0] ).toBe( 302 );
            expect( res.writeHead[1]['Set-Cookie'] ).toEqual( [
                'bxgraphOptOut=1; expires=' + futureDate + '; domain=.cdnwidget.com; path=/',
                '__adcontext=; domain=.cdnwidget.com; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/' ] );
        } );

        it( 'Status Request: should work with multiple domains', ()=>{
            urlPath = '/?action_id=3&participant_id=650&rd=http://optout.networkadvertising.org&noCache=1515514789879&count=0&cs=1&ncs=1';
            res = getResponse( urlPath, req, res );

            expect( res.url.hostname ).toBe( c.OPTOUT_DOMAINS[1] );
            expect( res.writeHead[0] ).toBe( 302 );
            expect( res.url.query.count ).toBe( '1' );
            expect( res.url.query.domain ).toBe( 'cdnwidget.com' );
            expect( res.url.query.cs ).toBe( '1' );
            expect( res.url.query.ncs ).toBe( '1' );
        } );

        it( 'Optout Request: should work with multiple domains', ()=>{
            urlPath = '/?action_id=4&participant_id=650&rd=http://optout.networkadvertising.org&noCache=1515514789879&count=0&cs=1&ncs=1';
            res = getResponse( urlPath, req, res );
            expect( res.url.hostname ).toBe( c.OPTOUT_DOMAINS[1] );
            expect( res.writeHead[0] ).toBe( 302 );
            expect( res.url.query.count ).toBe( '1' );
            expect( res.url.query.domain ).toBe( 'cdnwidget.com' );
            expect( res.url.query.cs ).toBe( '1' );
            expect( res.url.query.ncs ).toBe( '1' );
            expect( res.writeHead[1]['Set-Cookie'] ).toEqual( [
                'bxgraphOptOut=1; expires=' + futureDate + '; domain=.cdnwidget.com; path=/',
                '__adcontext=; domain=.cdnwidget.com; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/' ] );
        } );

        it( 'Status Request: should redirect to NAI once no more domain to be checked', ()=>{
            urlPath = '/?action_id=3&participant_id=650&rd=http://optout.networkadvertising.org&noCache=1515514789879&count=1&cs=2&ncs=2';
            res = getResponse( urlPath, req, res );

            expect( res.url.hostname ).toBe( 'optout.networkadvertising.org' );
            expect( res.writeHead[0] ).toBe( 302 );
            expect( res.url.href ).toBe( 'http://optout.networkadvertising.org/token/650/1-1' );
        } );

        it( 'Optout Request: should redirect to NAI once no more domain to be checked', ()=>{
            urlPath = '/?action_id=4&participant_id=650&rd=http://optout.networkadvertising.org&noCache=1515514789879&count=1&cs=2&ncs=2';
            res = getResponse( urlPath, req, res );

            expect( res.url.hostname ).toBe( 'optout.networkadvertising.org' );
            expect( res.writeHead[0] ).toBe( 302 );
            expect( res.url.href ).toBe( 'http://optout.networkadvertising.org/finish/650/4/1-1' );
        } );

        it( 'should establish first party relationship', ()=>{
            req.url = '/?action_id=5&participant_id=650&rd=http://optout.networkadvertising.org&noCache=1515514789879';
            onRequest( req, res );

            expect( res.writeHead.mock.calls[0][1]['Set-Cookie'] ).toBe( 'FPtrust=1;domain=.cdnwidget.com' );
            expect( res.writeHead.mock.calls[0][0] ).toBe( 200 );
        } );

        it( 'Status Request: with only 1 domain - when AD_COOKIE is found in headers respond directly from server with status ', ()=>{
            jest.unmock( '../src/constants.js' );
            jest.resetModules();
            const onRequest = require( '../index.js' ).onRequest;
            req.headers.cookie = '__adcontext=1';
            req.url = '/?action_id=3&participant_id=650&rd=http://optout.networkadvertising.org&noCache=1515514789879';
            onRequest( req, res );

            expect( res.writeHead.mock.calls[0][0] ).toBe( 302 );
            expect( res.writeHead.mock.calls[0][1].Location ).toBe( 'http://optout.networkadvertising.org/token/650/2-2' );
        } );

        it( 'Status Request: with only 1 domain - when OPTOUT_COOKIE is found in headers respond directly from server with status ', ()=>{
            jest.unmock( '../src/constants.js' );
            jest.resetModules();
            const onRequest = require( '../index.js' ).onRequest;
            req.headers.cookie = 'bxgraphOptOut=1';
            req.url = '/?action_id=3&participant_id=650&rd=http://optout.networkadvertising.org&noCache=1515514789879';
            onRequest( req, res );

            expect( res.writeHead.mock.calls[0][0] ).toBe( 302 );
            expect( res.writeHead.mock.calls[0][1].Location ).toBe( 'http://optout.networkadvertising.org/token/650/3-3' );
        } );
    } );

    describe( 'Testing functionality of YOC requests'.magenta, () => {
        utils.makeToken =  jest.fn().mockImplementation( () => {
            return 'npHFBB3adnAJq4ixazGn';
        } );
        let token = `token=${utils.makeToken()}`;

        it( 'Should provide nocookie status', () => {
            req.url = urlPath = '/yoc?action=status';
            onRequest( req, res );

            expect( res.writeHead.mock.calls[0][0] ).toBe( 302 );
            expect( res.writeHead.mock.calls[0][1].P3P ).toBeDefined();
            expect( res.writeHead.mock.calls[0][1].Location ).toBe( `${c.YOC_URL}status=nocookie&token=npHFBB3adnAJq4ixazGn` );
            expect( res.writeHead.mock.calls[0][1]['Set-Cookie'] ).toBe( 'token=npHFBB3adnAJq4ixazGn; domain=.cdnwidget.com; path=/' );
            expect( res.end ).toBeCalled();
        } );

        it( 'Should provide optedout status', () => {
            req.url = urlPath = '/yoc?action=status';
            req.headers.cookie = 'bxgraphYOCOptOut=1';
            onRequest( req, res );
            expect( res.writeHead.mock.calls[0][0] ).toBe( 302 );
            expect( res.writeHead.mock.calls[0][1].Location ).toBe( `${c.YOC_URL}status=optedout&${token}` );
            expect( res.end ).toBeCalled();
        } );

        it( 'Should provide cookie status', () => {
            req.url = urlPath = '/yoc?action=status';
            req.headers.cookie = '__3idcontext=1';
            onRequest( req, res );
            expect( res.writeHead.mock.calls[0][0] ).toBe( 302 );
            expect( res.writeHead.mock.calls[0][1].Location ).toBe( `${c.YOC_URL}status=cookie&${token}` );
            expect( res.end ).toBeCalled();
        } );

        it( 'Should provide set optout cookie, expire cookies and redirect for status check', () => {
            req.url = urlPath = `/yoc?action=optout&${token}`;
            req.headers.cookie = token;
            onRequest( req, res );
            expect( utils.YOCLog.mock.calls[0][1].message ).toBe( 'YOC: Optout Request' );
            expect( res.writeHead.mock.calls[0][0] ).toBe( 302 );
            expect( res.writeHead.mock.calls[0][1].Location ).toBe( `http://optout.cdnwidget.com/yoc?action=status&${token}` );
            expect( res.writeHead.mock.calls[0][1]['Set-Cookie'] ).toEqual( [
                'bxgraphYOCOptOut=1; expires=' + futureDate + '; domain=.cdnwidget.com; path=/',
                '__3idcontext=; domain=.cdnwidget.com; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/',
                '__adcontext=; domain=.cdnwidget.com; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/' ] ),
            expect( res.end ).toBeCalled();
        } );

        it( 'Should return an error when tokens do not match and log', () => {
            req.url = urlPath = '/yoc?action=optout&token=1234';
            req.headers.cookie = token;
            onRequest( req, res );
            expect( utils.YOCLog.mock.calls[0][0].action ).toBe( 'optout' );
            expect( utils.YOCLog.mock.calls[0][0].token ).toBe( '1234' );
            expect( utils.YOCLog.mock.calls[0][1].message ).toBe( 'Bad Token' );
            expect( utils.YOCLog.mock.calls[0][2] ).toBe( 'npHFBB3adnAJq4ixazGn' );
            expect( res.writeHead.mock.calls[0][0] ).toBe( 400 );
            expect( res.writeHead.mock.calls[0][1] ).toBe( c.BAD_TOKEN_MESSAGE );
            expect( res.end ).toBeCalled();
        } );

        it( 'Should expire optout cookie and redirect for status check', () => {
            req.url = urlPath = `/yoc?action=optin&${token}`;
            req.headers.cookie = token;
            onRequest( req, res );
            expect( utils.YOCLog.mock.calls[0][1].message ).toBe( 'YOC: Optin Request' );
            expect( res.writeHead.mock.calls[0][0] ).toBe( 302 );
            expect( res.writeHead.mock.calls[0][1].P3P ).toBeDefined();
            expect( res.writeHead.mock.calls[0][1].Location ).toBe( `http://optout.cdnwidget.com/yoc?action=status&${token}` );
            expect( res.writeHead.mock.calls[0][1]['Set-Cookie'] ).toBe( 'bxgraphYOCOptOut=; domain=.cdnwidget.com; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/' );
            expect( res.end ).toBeCalled();
        } );
    } );
} );
/*
 ====================================================================

 HARDAC

 --------------------------------------------------------------------
 Copyright (c) 2016 by Krogoth of
 Ministry of Zombie Defense - http://www.mzd.org.uk/
 and contributing authors

 --------------------------------------------------------------------

 This file is part of HARDAC. See server.js for details.

 ====================================================================
 */

var util = require('util');
var log = require('./log').log;
var config = require('../config').config;
var PJ = require('./db').PJ;
var sequelize = require('./db').sequelize;
var moment = require('moment');


function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

// // get number of PJs (registered, unregistered, longtimenosee, last30mins)
function sendRegisteredPJClientStats(res) {
    res.writeHead(200, {'Content-Type': 'application/json'});

    var users = 0;
    var speakers = 0;
    var staff = 0;
    var goons = 0;

    PJ.count({where: {group: 0}}).then(function (c1) {
        users = c1;

        PJ.count({where: {group: 1}}).then(function (c2) {
            speakers = c2;

            PJ.count({where: {group: 2}}).then(function (c3) {
                staff = c3;
                PJ.count({where: {group: 4}}).then(function (c4) {
                    goons = c4;

                    var data = util.format("\"users\": [%s, %s, %s, %s]", users, speakers, staff, goons);
                    var json = util.format("{%s}", data);

                    res.end(json);
                });
            });
        });
    });
}

function sendVoteStats(res)
{
    res.writeHead(200, {'Content-Type': 'application/json'});

    var left = 320;
    var right = 250;


    PJ.findAll({
        attributes: ['ballot', [sequelize.fn('count', sequelize.col('ballot')), 'ballotcount']],
        group: ["PJ.ballot"]
    }).then(function (result) {

        var data = "";
        result.forEach(function(ballot)
        {
            if(data.length > 0)
            {
                data += ",";
            }
            data += "\"" + ballot.ballot + "\": [" + ballot.get('ballotcount') + "]";
        });

        log.info(data);

        var json = util.format("{%s}", data);

        res.end(json);

    });
}

function sendActivePJClientStats(res) {
    res.writeHead(200, {'Content-Type': 'application/json'});

    var val1 = 0;
    var val2 = 0;
    var val3 = 0;
    var val4 = 0;
    var val5 = 0;

    moment().subtract(7, 'days').toDate()

    PJ.count({where: {lastSeen: {$gt: moment().subtract(30, 'minutes').toDate()}}}).then(function (c1) {

        val1 = c1;

        PJ.count({where: {lastSeen: {$gt: moment().subtract(2, 'hours').toDate()}}}).then(function (c2) {

            val2 = c2;

            PJ.count({where: {lastSeen: {$gt: moment().subtract(5, 'hours').toDate()}}}).then(function (c3) {

                val3 = c3;

                PJ.count({where: {lastSeen: {$gt: moment().subtract(24, 'hours').toDate()}}}).then(function (c4) {

                    val4 = c4;

                    PJ.count({where: {lastSeen: {$let: moment().subtract(24, 'hours').toDate()}}}).then(function (c5) {

                        val5 = c5;

                        var data = util.format("\"users\": [%s, %s, %s, %s, %s]", val1, val2, val3, val4, val5);
                        var json = util.format("{%s}", data);

                        res.end(json);
                    });
                });
            });
        });
    });

}

    //var data1 = util.format("\"data1\": [%s, %s, %s, %s, %s]", randomInt(1, 300), randomInt(1, 300), randomInt(1, 300), randomInt(1, 300), randomInt(1, 300));
    //var data2 = util.format("\"data2\": [%s, %s, %s, %s, %s]", randomInt(1, 300), randomInt(1, 300), randomInt(1, 300), randomInt(1, 300), randomInt(1, 300));
    //var data3 = util.format("\"data3\": [%s, %s, %s, %s, %s]", randomInt(1, 300), randomInt(1, 300), randomInt(1, 300), randomInt(1, 300), randomInt(1, 300));

    //var json = util.format("{%s, %s, %s}", data1, data2, data3);
    /*
    "{  
    \"data1\": [randomInt(1, 300), randomInt(1, 300), randomInt(1, 300), randomInt(1, 300), randomInt(1, 300)], 
    \"data2\": [randomInt(1, 300), randomInt(1, 300), randomInt(1, 300), randomInt(1, 300), randomInt(1, 300)], 
    \"data3\": [randomInt(1, 300), randomInt(1, 300), randomInt(1, 300), randomInt(1, 300), randomInt(1, 300)] }"
    */
    
    /*
    PJ.findOne({ where: {deviceId: deviceid}}).then(function(pj)
    {
        if(pj == null || pj == undefined)
        {
            log.debug('Device not found: ' + deviceid);

            res.writeHead(403, {'Content-Type': 'text/plain', 'HARDAC-STATUS': '403'});
            res.end("Register first at the HARDAC");
            return;
        }
        else
        {
            log.debug('Device wants status: ' + deviceid);

            res.writeHead(200, {'Content-Type': 'application/json', 'HARDAC-STATUS': '200'});

            var reply = "{ \"m1\": \"%s\", \"m2\": \"%s\", \"mrc\": \"%s\", \"cl\": \"%s\" }";
            var json = util.format(reply, pj.led1, pj.led2, pj.movieReplayCount, pj.cycleLength);

            log.debug('Reply: Chars: ' + json.length + ', content: ' + json);

            res.end(json);
        }

        pj.lastSeen = Date.now();

        pj.save().then(function()
        {
            log.info('PJ ' + deviceid + ' lastSeen updated: ' + pj.lastSeen);
        });
    });
    */

// Exporting.
module.exports = {
    sendRegisteredPJClientStats: sendRegisteredPJClientStats,
    sendVoteStats: sendVoteStats,
    sendActivePJClientStats: sendActivePJClientStats
};
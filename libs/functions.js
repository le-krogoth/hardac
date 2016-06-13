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

function clearAllVotes(res)
{
    res.writeHead(200, {'Content-Type': 'application/json'});

    PJ.update(
        { ballot: 0 },
        {where: {}}
    ).spread(function(affectedCount, affectedRows) {
        // .update returns two values in an array, therefore we use .spread
        // Notice that affectedRows will only be defined in dialects which support returning: true

        //og.info(affectedCount);
        //log.info(affectedRows);

        var json = JSON.stringify({
            info: 'Votes cleared',
            exitCode: 0,
            programOutput: 'affectedCount = ' + affectedCount
        });

        res.end(json);
    });
}

function triggerRedBlink(res)
{
    res.writeHead(200, {'Content-Type': 'application/json'});

    PJ.update(
        { led1: 'F0020002F0020002F0020002', led2: 'F0020002F0020002F0020002', movieReplayCount: 3 },
        {where: {group: 0}}
    ).spread(function(affectedCount, affectedRows) {
        // .update returns two values in an array, therefore we use .spread
        // Notice that affectedRows will only be defined in dialects which support returning: true

        //og.info(affectedCount);
        //log.info(affectedRows);

        var json = JSON.stringify({
            info: 'Red Blink triggered',
            exitCode: 0,
            programOutput: 'affectedCount = ' + affectedCount
        });

        res.end(json);
    });
}

function addDemoUsersToDB(res)
{
    res.writeHead(200, {'Content-Type': 'application/json'});

    PJ.bulkCreate([
        { deviceId: 'demouser0', group: 0 },
        { deviceId: 'demouser1', group: 0 },
        { deviceId: 'demouser2', group: 0 },
        { deviceId: 'demouser3', group: 0 },
        { deviceId: 'demouser4', group: 0 },
        { deviceId: 'staff0', group: 2 },
        { deviceId: 'staff1', group: 2 },
        { deviceId: 'speaker0', group: 1 },
        { deviceId: 'speaker1', group: 1 },
        { deviceId: 'goon0', group: 4 }
    ]).then(function() { // Notice: There are no arguments here..

        var json = JSON.stringify({
            info: 'Demo Users added',
            exitCode: 0,
            programOutput: 'none'
        });

        res.end(json);
    }).catch(function(reason){

        var json = JSON.stringify({
            info: 'Demo Users could not be added',
            exitCode: -1,
            programOutput: 'Users already exist?'
        });

        res.end(json);
    });
}

function triggerMovie(res, userGroup, movie1, movie2, replayCount)
{
    res.writeHead(200, {'Content-Type': 'application/json'});

    if( !userGroup || !movie1 || !movie2 ) {

        var json = JSON.stringify({
            info: path,
            exitCode: -1,
            programOutput: 'parameter missing'
        });

        res.end(json);
        return;
    }

    if(!replayCount)
    {
        replayCount = 0;
    }

    var filter = {};
    if(userGroup >= 0 && userGroup < 5)
    {
        filter = { group: userGroup };
    }

    // clean it to not get any special chars
    movie1 = movie1.replace(new RegExp('[^a-zA-Z0-9]+', 'g'), '');
    movie2 = movie2.replace(new RegExp('[^a-zA-Z0-9]+', 'g'), '');

    // makro, no movie given, replace
    if(movie1.indexOf('m') === 0)
    {
        movie1 = makro2Movie(movie1);
    }

    // makro, no movie given, replace
    if(movie2.indexOf('m') === 0)
    {
        movie2 = makro2Movie(movie2);
    }

    PJ.update(
        { led1: movie1, led2: movie2, movieReplayCount: replayCount },
        { where: filter }
    ).spread(function(affectedCount, affectedRows) {
        // .update returns two values in an array, therefore we use .spread
        // Notice that affectedRows will only be defined in dialects which support returning: true

        //log.info(affectedCount);
        //log.info(affectedRows);

        var json = JSON.stringify({
            info: 'Movie triggered',
            exitCode: 0,
            programOutput: 'affectedCount = ' + affectedCount
        });

        res.end(json);
    });

    function makro2Movie(makro)
    {
        var ret = "";

        switch(makro)
        {
            case "m1":
                ret = "F0010002F0020002F0020002";
                break;
            case "m2":
                ret = "F0020002F0020002F0020002";
                break;
            case "m3":
                ret = "F0030002F0020002F0020002";
                break;
            default:
                ret = "F00A0002F0020002F0020002";
        }

        return ret;
    }
}

// Exporting.
module.exports = {
    clearAllVotes: clearAllVotes,
    triggerRedBlink: triggerRedBlink,
    addDemoUsersToDB: addDemoUsersToDB,
    triggerMovie: triggerMovie
};
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
    });
}

// Exporting.
module.exports = {
    clearAllVotes: clearAllVotes,
    triggerRedBlink: triggerRedBlink,
    addDemoUsersToDB: addDemoUsersToDB
};
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

var log = require('./log').log;

function registerDevice(req, res, deviceid, publickey)
{
    //
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("registered device: " + deviceid);
}

function getStatus(req, res, deviceid)
{
    //
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("sent state to device: " + deviceid);
}

function vote(req, res, deviceid, ballot)
{
    //
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("handled vote for device: " + deviceid);
}

// url to be processed is unknown
function onBypass(req, res, path)
{
    log.info('URL unknown: ' + path);

    //
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("huh?");
}

// Exporting.
module.exports = {
    registerDevice: registerDevice,
    getStatus: getStatus,
    vote: vote,
    onBypass: onBypass
};
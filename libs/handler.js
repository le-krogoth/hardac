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
var config = require('../config').config;
var PJ = require('./db').PJ;

// tries to register new device and sends an error if device is registered already
function registerDevice(req, res, deviceid, publickey)
{
    if(deviceid == undefined || publickey == undefined)
    {
        // Bad Request
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end("Not all parameters were given.");
        return;
    }

    PJ.findOrCreate({ where: {deviceId: deviceid}}).spread(function(pj, created)
    {
        if(created)
        {
            log.debug('Created new PJ: ' + JSON.stringify(pj, null, 4));

            res.writeHead(201, {'Content-Type': 'text/plain'});
            res.end("Welcome at the HARDAC, " + deviceid);
        }
        else
        {
            // this device already registered and can't register again
            log.debug('Device wanted to re-register: ' + JSON.stringify(pj, null, 4));

            res.writeHead(420, {'Content-Type': 'text/plain'});
            res.statusMessage = 'Enhance Your Calm';
            res.end("Stay calm");
            return;
        }

        pj.save().then(function()
        {
            log.info('New PJ saved');
        });
    });
}

// hardac sends led (and other) information to the pj
function getStatus(req, res, deviceid)
{
    if(deviceid == undefined || deviceid == null)
    {
        // Bad Request
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end("Not all parameters were given.");
        return;
    }

    PJ.findOne({ where: {deviceId: deviceid}}).then(function(pj)
    {
        if(pj == null || pj == undefined)
        {
            log.debug('Device not found: ' + deviceid);

            res.writeHead(403, {'Content-Type': 'text/plain'});
            res.end("Register first at the HARDAC");
            return;
        }
        else
        {
            log.debug('Device wants status: ' + deviceid);

            res.writeHead(200, {'Content-Type': 'text/plain'});

            var colour = "{ \"colour_1\": \"" + pj.led1 + "\", \"colour_2\": \"" + pj.led2 + "\" }";

            res.end(colour);
        }

        pj.lastSeen = Date.now();

        pj.save().then(function()
        {
            log.info('PJ ' + deviceid + ' lastSeen updated');
        });
    });
}

// pj sends ballot
function vote(req, res, deviceid, ufballot)
{
    if(deviceid == undefined || deviceid == null || ufballot == undefined || ufballot == null)
    {
        // Bad Request
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end("Not all parameters were given.");
        return;
    }

    var ballot = ufballot.replace(/[^0-9]/gi, '');

    if(ballot == '' || ballot.length > 4)
    {
        // Bad Request
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end("Not all parameters were given or within accepted range.");
        return;
    }

    PJ.findOne({ where: {deviceId: deviceid}}).then(function(pj)
    {
        if(pj == null || pj == undefined)
        {
            log.debug('Device not found: ' + deviceid);

            res.writeHead(403, {'Content-Type': 'text/plain'});
            res.end("Register first at the HARDAC");
            return;
        }
        else
        {
            log.debug('Device wants to vote: ' + deviceid);

            res.writeHead(202, {'Content-Type': 'text/plain'});
            res.end("Ballot accepted");
        }

        pj.lastSeen = Date.now();
        pj.ballot = ballot;

        pj.save().then(function()
        {
            log.info('PJ ' + deviceid + ' ballot updated');
        });
    });
}

// url to be processed is unknown
function onBypass(req, res, path)
{
    log.info('URL unknown: ' + path);

    // send out some help text to get started
    // todo: remove me in production?
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<!doctype html>\n\r<html lang=en>\n\r<head>\n\r<meta charset=utf-8>\n\r<title>HARDAC</title>\n\r</head>\n\r");
    res.write("<body>\n\r");

    res.write("<h1>Welcome to the HARDAC</h1>\n\r");
    res.write("<p>Register your client with HARDAC <a href='http://" + config.ip_server + ":" + config.port_server + "/device_id/r/public_key/'>here</a></p>\n\r");
    res.write("<p>Check commands for your client <a href='http://" + config.ip_server + ":" + config.port_server + "/device_id/s/'>here</a></p>\n\r");
    res.write("<p>Cast your ballot <a href='http://" + config.ip_server + ":" + config.port_server + "/device_id/v/19'>here</a></p>\n\r");

    res.write("</body>\n\r");
    res.write("</html>\n\r");
    res.end("");
}

// Exporting.
module.exports = {
    registerDevice: registerDevice,
    getStatus: getStatus,
    vote: vote,
    onBypass: onBypass
};
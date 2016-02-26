/*
 ====================================================================

 HARDAC

 --------------------------------------------------------------------
 Copyright (c) 2016 by Krogoth of
 Ministry of Zombie Defense - http://www.mzd.org.uk/
 and contributing authors

 This file is part of HARDAC.

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published
 by the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ====================================================================
 */


//---------------------------------------------------------------------------
var config = require('./config').config;

var log = require('./libs/log').log;

var handler = require('./libs/handler');

var crossroads = require('crossroads');
crossroads.ignoreState = true;

var http = require('http');
var url  = require('url');

//----------------------------------------------------------------------------
crossroads.addRoute('/{device_id}/r/{public_key}/', handler.registerDevice);
crossroads.addRoute('/{device_id}/s/', handler.getStatus);
crossroads.addRoute('/{device_id}/v/{ballot}', handler.vote);

crossroads.bypassed.add(handler.onBypass);
//----------------------------------------------------------------------------

//
var server = http.createServer(function (req, res)
{
    var sUrl = url.parse(req.url).path;
    log.debug("Processing request for path: " + sUrl);

    crossroads.parse(sUrl, [req, res]);
});

// make sure that the server does not crash on unhandled errors
server.on('error', function (e)
{
    log.error("Error: " + e);
});

// start server
server.listen(config.port_server, config.ip_server);

// print some details for the admin / dev
log.info("Server running at http://" + config.ip_server + ":" + config.port_server + "/");
log.debug("Register your client with HARDAC at that url: http://" + config.ip_server + ":" + config.port_server + "/device_id/r/public_key/");
log.debug("Check commands for your client at this url: http://" + config.ip_server + ":" + config.port_server + "/device_id/s/");
log.debug("Vote for your client at this url: http://" + config.ip_server + ":" + config.port_server + "/device_id/v/ballot");

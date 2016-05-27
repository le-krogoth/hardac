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

var http = require('http');
var crossroads = require('crossroads');
crossroads.ignoreState = true;

var log = require('./libs/log').log;

var url = require('url');
var fs = require('fs');

var stats = require('./libs/stats');
var fncts = require('./libs/functions');

function onRedirectToRoot(req, res, path)
{
    log.info('Redirect to root URL');

    res.writeHead(301, {"Location": '/s/index.html'});

    res.end();
}

function onBypass(req, res, path)
{
    log.info('URL unknown: ' + path);

    res.writeHead(200, {'Content-Type': 'application/json'});

    var json = JSON.stringify({
        info: path,
        exitCode: -1,
        programOutput: 'function unknown'
    });

    res.end(json);
}

function onGetData(req, res, query)
{
    log.info('Get Data: ' + query);

    switch (query) {
        case "registeredPJs":
            stats.sendRegisteredPJClientStats(res);
            break;
        case "activePJs":
            stats.sendActivePJClientStats(res);
            break;
        case "votes":
            stats.sendVoteStats(res);
            break;
        default:
            log.error("This query type is unknown: " + query + ".");

            res.writeHead(200, {'Content-Type': 'application/json'});

            var json = JSON.stringify({
                info: path,
                exitCode: -1,
                programOutput: 'query unknown'
            });

            res.end(json);
    }
}

function onExecFunction(req, res, fnct)
{
    log.info('Exec Function: ' + fnct);

    switch (fnct) {
        case "clear_all_votes":
            fncts.clearAllVotes(res);
            break;
        case "trigger_red_blink":
            fncts.triggerRedBlink(res);
            break;
        case "add_demo_users":
            fncts.addDemoUsersToDB(res);
            break;
        default:
            log.error("This function type is unknown: " + fnct + ".");

            res.writeHead(200, {'Content-Type': 'application/json'});

            var json = JSON.stringify({
                info: path,
                exitCode: -1,
                programOutput: 'fnct unknown'
            });

            res.end(json);
    }
}

function onGetStaticContent(req, res, url)
{
    //res.writeHead(200, {'Content-Type': 'text/plain'});

    var file = 'wwwroot/' + url.replace(new RegExp('[^a-zA-Z0-9./-]+', 'g'), '');
    //file = file.replace(new RegExp('\.\.', 'g'), '');

    log.info('File requested: ' + file);

    if(fs.existsSync(file))
    {
        fs.readFile(file, function (err, data)
        {
            if (err) throw err;
            res.write(data);

            res.end('');
        });
    }
    else
    {
        res.write('file unknown');

        res.end('');
    }
}

// -----------------------------------------------------------------------------
crossroads.addRoute('/data/{query}', onGetData);
crossroads.addRoute('/fn/{fnct}', onExecFunction);

crossroads.addRoute('/s/{url*}', onGetStaticContent);

crossroads.addRoute('/', onRedirectToRoot);

crossroads.bypassed.add(onBypass);

// -----------------------------------------------------------------------------
var server = http.createServer(function (req, res)
{
    var sUrl = url.parse(req.url).pathname;
    log.info("URL requested: " + sUrl);
    crossroads.parse(sUrl, [req, res]);

});

process.on('uncaughtException', function(err)
{
    console.log('Caught exception: ' + err);
});

server.listen(config.port_admin, config.ip_admin);
log.info("Server running at http://" + config.ip_admin + ":" + config.port_admin + "/");
log.debug("Load the HARDAC dashboard at that url: http://" + config.ip_admin + ":" + config.port_admin + "/");

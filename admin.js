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

var url = require('url');
var fs = require('fs');

var stats = require('./libs/stats');

function onRedirectToRoot(req, res, path)
{
    console.log('Redirect to root URL');

    res.writeHead(301, {"Location": '/s/index.html'});

    res.end();
}

function onBypass(req, res, path)
{
    console.log('URL unknown' + path);

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
    console.log('Get Data: ' + query);

    switch (query) {
        case "registeredPJs":
            stats.sendRegisteredPJClientStats(res);
            break;
        case "activePJs":
            stats.sendActivePJClientStats(res);
            break;
        default:
            console.error("This query type is unknown: " + expr + ".");

            res.writeHead(200, {'Content-Type': 'application/json'});

            var json = JSON.stringify({
                info: path,
                exitCode: -1,
                programOutput: 'query unknown'
            });

            res.end(json);
    }
}

function onGetStaticContent(req, res, url)
{
    //res.writeHead(200, {'Content-Type': 'text/plain'});

    var file = 'wwwroot/' + url.replace(new RegExp('[^a-zA-Z0-9./-]+', 'g'), '');
    //file = file.replace(new RegExp('\.\.', 'g'), '');

    console.log('File requested: ' + file);

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

crossroads.addRoute('/s/{url*}', onGetStaticContent);

crossroads.addRoute('/', onRedirectToRoot);

crossroads.bypassed.add(onBypass);

// -----------------------------------------------------------------------------
var server = http.createServer(function (req, res)
{
    var sUrl = url.parse(req.url).pathname;
    console.log("URL requested: " + sUrl);
    crossroads.parse(sUrl, [req, res]);

});

process.on('uncaughtException', function(err)
{
    console.log('Caught exception: ' + err);
});

server.listen(config.port_admin, config.ip_admin);
console.log('Server running on %s:%s', config.ip_admin, config.port_admin);

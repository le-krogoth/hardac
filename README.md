HARDAC
======

Copyright (c) 2016-23 by Krogoth of
Ministry of Zombie Defense - http://www.mzd.org.uk/
and contributing authors

## Archived ##
This repo is getting old and there is no plan (nor need) to work on this codebase anymore. It is therefore archived.  

## Installation ##
Get a copy of node.js and npm on your system of choice. If you are using Debian, this should work:

    apt-get install nodejs npm nodejs-legacy
    
You can leave nodejs-legacy if you do not need the symlinks coming with that package.

Get your copy of HARDAC

    git clone https://github.com/le-krogoth/hardac.git
    
And use the magic of npm to install the dependencies

    npm install

After that you can run the PJ backend with one of these commands

    node server.js
    npm start
    
And run the admin backend with the following command

    node admin.js
    
Please have a look at the console to get some further instructions.    

If you intend to run HARDAC in production, please consider to use an observer daemon. There is an example configuration
in the utilities folder:

    cp utilities/hardac_supervisor.conf /etc/supervisor/conf.d/hardac.conf 

And make sure you change those parameters.

## Configuration ##

The standard configuration of HARDAC runs off a local sqlite3 DB. You might want to change that when running in production. 
You can find the configuration options within config.js.


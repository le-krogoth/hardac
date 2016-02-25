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

var log4js = require('log4js');
var log = log4js.getLogger("hardac");

function initialise()
{
    log.debug("logger loaded");
}

// Exporting.
module.exports = {
    log: log
};

initialise();

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

var config =
{
    // ip to bind to, use 0.0.0.0 to bind to all
    ip_server: "127.0.0.1",

    // port to bind to
    port_server: 8765,

    db_name: "hardac",
    db_uid: "user",
    db_pwd: "pwd",
    db_dialect: "sqlite",
    db_logging: false,
    db_storage: "hardac.sqlite"
};

module.exports = {
    config: config
};
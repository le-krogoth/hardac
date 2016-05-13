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

var Sequelize = require('sequelize');

var sequelize = new Sequelize(config.db_name, config.db_uid, config.db_pwd, {
    dialect: config.db_dialect,
    logging: config.db_logging,
    storage: config.db_storage,
    define: {
        //prevent sequelize from pluralizing table names
        freezeTableName: true
    }
});

// group: the group(s) the user of this pj is member of.
//    0 - default users
//    1 - speaker
//    2 - staff
//    4 - goons
var PJ = sequelize.define('pj', {
    deviceId: { type: Sequelize.STRING, allowNull: false, unique: true, primaryKey: true},
    led1: { type: Sequelize.STRING, allowNull: false, defaultValue: "F0020002F0020002F0020002"},
    led2: { type: Sequelize.STRING, allowNull: false, defaultValue: "0F0200020F0200020F020002"},
    movieReplayCount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    ballot: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
    cycleLength: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1000},
    lastSeen: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    group: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }
});

sequelize.sync().then(function()
    {
        log.info("Database structure updated");
    }).error(function(error)
    {
        log.error("Database structure update crashed: " + error);
    }
);

// Exporting.
module.exports = {
    PJ: PJ,
    sequelize: sequelize
};
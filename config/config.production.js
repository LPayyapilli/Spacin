var config = require('./config.global.js');

config.env = 'production';
config.hostname = 'herokuapp link'
config.serverPort = process.env.PORT;

config.mongo = {};
config.mongo.dbUrl = process.env.DBURL;

module.exports = config;

var config = require('./config.global.js');

config.env = 'production';
config.hostname = 'herokuapp link'
config.serverPort = 'http://lpayyapilli.github.io';

config.mongo = {};
config.mongo.dbUrl = process.env.DBURL;

module.exports = config;

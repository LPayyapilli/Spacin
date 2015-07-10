var config = require('./config.global.js');

config.env = 'development';
config.hostname = 'localhost';
config.servePort = 3000;

config.mongo = {};

config.mongo.dburl = 'mongodb://lukepayyapilli:Thesmart5@ds041871.mongolab.com:41871/clarkedb'

module.exports = config;

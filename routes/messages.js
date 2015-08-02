var express = require('express');
var router = express.Router();
var async = require('async');
var Message = require('../models/message.js');
var fs = require('fs');
var AWS = require('aws-sdk');
var bodyParser = require('body-parser');
var crypto =require('crypto');

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.send(400);
  res.end();
}

//////////////////// POST a Message//////////////////////
/////////////////////////////////////////////////////////
router.post('/message/new', isAuthenticated, function(req, res) {
  var newMessage = new Message();

  newMessage.title = req.body.title;
  newMessage._creator = req.user.username;
  newMessage.postedAt = new Date();
  newMessage.body = req.body.body;

  newMessage.save(function(err) {
    if (err) {
      console.log('Error in Saving status: ' + err);
      res.end();
      throw err;
    } else {
      console.log('picture saved!');
      res.send(200);
      res.end();
    }
  });
});

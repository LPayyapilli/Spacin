var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var async = require('async');
var Space = require('../models/space.js');
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

/* Upload a picture */

var aws_access_key =  process.env.AWS_ACCESS_KEY_ID;
var aws_secret_key = process.env.AWS_SECRET_KEY_ID;

var s3_upload_signature = function(base64Policy){
  var sig = crypto.createHmac("sha1", aws_secret_key).update(base64Policy).digest("base64");
  return sig;
}

var create_s3_upload_policy = function(){
  var date = new Date();
  date.setDate(date.getDate() + 1);

  var s3Policy = {
    "expiration": date,
    "conditions": [
      ["starts-with", "$key", ""],
      {"bucket": "clarkedbteer"},
      {"acl": "public-read"},
      ["starts-with", "$Content-Type", ""],
      [ "content-length-range", 0, 20 * 1024 * 1024 ]
    ]
  };

  // stringify and encode the policy
  var stringPolicy = JSON.stringify(s3Policy);
  var base64Policy = Buffer(stringPolicy, "utf-8").toString("base64");
  var token = {
    policy: base64Policy,
    signature: s3_upload_signature(base64Policy),
    key: aws_access_key
  }
  return token;
}

/* GET for AWS-NG Upload */
router.get('/s3access', isAuthenticated, function(req, res){
  var token = create_s3_upload_policy();
  res.json(token);
});



/* POST a Space */

router.post('/new', isAuthenticated, function(req, res) {
  var newSpace = new Space();

  newSpace.caption = req.body.caption;
  newSpace.name = req.body.name;
  newSpace._creator = req.user.username;
  newSpace.postedAt = new Date();
  newSpace.zip = req.body.address.zip;

  if (req.body.src) {
    newSpace.pictures.push({
      src: req.body.src,
      postedAt: new Date(),
      caption: req.body.caption,
      _creator: req.user.username
    });
    }
  newSpace.address.number = req.body.address.number;
  newSpace.address.street = req.body.address.street;
  newSpace.address.state = req.body.address.state;
  newSpace.address.zip = req.body.address.zip;
  newSpace.category = req.body.category;

  newSpace.save(function(err) {
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

/////////////GET All Spaces/////////////////
////////////////////////////////////////////////////////
router.get('/all', isAuthenticated, function(req, res) {
  Space.find({
    })
    .sort('-postedAt')
    .exec( function(error, spaces) {
      if (error) {
        console.log(error);
        res.status(404);
        res.end();
      }
      res.send(spaces);
  });
});

/////////////GET All Spaces from a User/////////////////
////////////////////////////////////////////////////////
router.get('/user/all', isAuthenticated, function(req, res) {
  Space.find({
      _creator: req.user.username
    })
    .sort('-postedAt')
    .exec( function(error, spaces) {
      if (error) {
        console.log(error);
        res.status(404);
        res.end();
      }
      res.send(spaces);
  });
});

/////////////////////GET One Space//////////////////////
////////////////////////////////////////////////////////
router.get('/_id', isAuthenticated, function(req, res) {
  Space.findOne({
    _id: req.params._id
  }).exec( function(error, space) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    res.send(space);
  });
});

/////////////////////GET Space by Zip///////////////////
////////////////////////////////////////////////////////
router.post('/search', isAuthenticated, function(req, res) {
  console.log(req.body.zip);
  Space.find({
    zip: req.body.zip
  }).exec( function(error, spaceList) {
    if(error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    res.send(spaceList);
  });
});

//////////////////// POST a Message//////////////////////
/////////////////////////////////////////////////////////
router.post('/message/new', isAuthenticated, function(req, res) {

  var newMessage = new Message();

  newMessage.title = req.body.title;
  // newMessage._creator = req.user.username;
  // newMessage.postedAt = new Date();
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

module.exports = router;

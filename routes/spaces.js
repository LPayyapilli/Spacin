var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var async = require('async');
var Space = require('../models/space.js');
var fs = require('fs');
var multer = require('multer');
var AWS = require('aws-sdk');
var bodyParser = require('body-parser');


var aws_access_key =  process.env.AWS_ACCESS_KEY_ID;
var aws_secret_key = process.env.AWS_SECRET_KEY_ID;

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

/* Create a Space */

router.post('/new', isAuthenticated, function(req, res) {
            var newSpace = new Space();

            newSpace.caption = req.body.caption;
            newSpace.name = req.body.name;
            newSpace._creator = req.user.username;
            newSpace.postedAt = new Date();
            newSpace.pictures = req.body.pictures;
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
        };
/////////////////////GET All Spaces/////////////////////
////////////////////////////////////////////////////////
router.get('/all', isAuthenticated, function(req, res) {
  Spaces.find({
      _creator: req.user.username
    })
    .sort('-postedAt')
    .exec( function(error, spaceList) {
      if (error) {
        console.log(error);
        res.status(404);
        res.end();
      }
      res.send({spaceList: spaceList
    });
  });
});



module.exports = router;

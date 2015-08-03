var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var async = require('async');
var Space = require('../models/space.js');

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

/* GET your user page */
router.get('/', isAuthenticated, function(req, res) {
  res.send(req.user);
});

/* GET All Users*/
router.get('/users', isAuthenticated, function(req, res) {
  User.find({})
  .select('-password')
  .exec(function(error, userList) {
    res.send(userList);
  });
});

/* POST to Profile Picture */
router.post('/newProfPic', isAuthenticated, function(req, res) {
  User.findOneAndUpdate({
       username: req.user.username
   },{profilePicture: req.body.pic},function(error, user) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
     }
     else {
      res.send(user);
    }
   });
});

/* POST to Background Picture */
router.post('/newBackPic', isAuthenticated, function(req, res) {
  User.findOneAndUpdate({
       username: req.user.username
   },{backgroundPicture: req.body.pic},function(error, user) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
     }
     else {
      res.send(user);
    }
   });
});

/* GET Other User's Spaces */
router.get('/all', isAuthenticated, function(req, res) {
  User.findOne({
    username: req.params.username
  })
  .select('-password')
  .exec(function(error, otherUser) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    Spaces.find({
      _creator: req.params.username
    })
    .sort('-postedAt')
    .exec( function(error, spaceList) {
      if (error) {
        console.log(error);
        res.status(404);
        res.end();
      }
        res.send({spaceList: spaceList, otherUser:otherUser})
      });
    });
  });


module.exports = router;


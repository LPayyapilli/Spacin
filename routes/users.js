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

/* PATCH to Profile Picture */
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

/* PATCH to Background Picture */

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

/* GET User's Spaces */
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


// router.post('/follow/:otherUser', isAuthenticated, function(req, res, next) {
//   User.findOne({username: req.user.username},function(error, user) {
//     var followed = false;
//     for (var i = 0; i < user.following.length; i++) {
//       if (user.following[i] === req.params.otherUser) {
//         followed = true;
//         console.log("cannot follow someone twice");
//         res.redirect('/auth/home');
//       }
//     }
//     if (followed === false) {
//       user.following.push(req.params.otherUser);
//       User.findOneAndUpdate({
//         username: req.user.username
//       }, {following: user.following}, function(err, user) {
//         if (err) {
//           console.log(err);
//           res.status(404);
//           res.end();
//         } else {
//           User.findOne({username: req.params.otherUser},function(error, otherUser) {
//             otherUser.followedBy.push(req.user.username);
//             User.findOneAndUpdate({
//               username: req.params.otherUser
//             }, {followedBy: otherUser.followedBy}, function(err, user) {
//               if (err) {
//                 console.log(err);
//                 res.status(404);
//                 res.end();
//               } else {
//                 res.redirect('/user/' + req.params.otherUser);
//               }
//             });
//           });
//         }
//       });
//     }
//   });
// });

module.exports = router;


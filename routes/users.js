var express = require('express');
var router = express.Router();

var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Status = require('../models/status.js');
var async = require('async');
var Picture = require('../models/picture.js');

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

/* GET All Users*/
router.get('/', isAuthenticated, function(req, res) {
  User.find({})
  .select('-password')
  .exec(function(error, userList) {
    res.send(userList);
  });
});

/* GET to Profile Picture */
router.get('/makeProfilePicture/:src', isAuthenticated, function(req, res) {
  User.findOneAndUpdate({
       username: req.user.username
   },{profilePicture: req.params.src},function(error, picture) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
     }
     else {
      res.status(200);
      res.end();
    }
   });
});

/* GET Background Picture */

router.get('/makeBackgroundPicture/:src', isAuthenticated, function(req, res) {
  User.findOneAndUpdate({
       username: req.user.username
   },{backgroundPicture: req.params.src},function(error, picture) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
     }
     else {
      res.status(200);
      res.end();
    }
   });
});


/* GET All followers*/
// router.get('/followers', isAuthenticated, function(req, res) {
//   User.findOne({username: req.user.username},function(error, user){
//     if (error) {
//       console.log(error);
//       res.status(404);
//       res.end();
//     } else {
//       var array = [];
//       var length = 0;
//       var followLength = user.followedBy.length;
//       if (followLength > 0){
//         for (var i = 0;i<followLength;i++) {
//           User.findOne({username: user.followedBy[i]},function(error, follower) {
//             if (error) {
//               console.log(error);
//               followLength = followLength - 1;
//             } else {
//               if (follower !== null) {
//               array.push(follower);
//             }
//             length +=1;
//               if(length === followLength){
//                 res.send(array);
//               }
//             }
//           });
//         }
//       }else {
//         res.status(404);
//         res.end();
//       }
//     }
//   });
// });

/* GET who I follow*/
// router.get('/followings', isAuthenticated, function(req, res) {
//   User.findOne({username: req.user.username},function(error, user){
//     if (error) {
//       console.log(error)
//       res.status(404);
//       res.end();
//     } else {
//       var array = [];
//       var length = 0;
//       var followLength = user.following.length;
//       if (followLength > 0){
//         for (var i = 0;i<followLength;i++) {
//           User.findOne({username: user.following[i]},function(error, follower) {
//             if (error) {
//               console.log(error);
//               followLength = followLength - 1;
//             } else {
//               array.push(follower);
//               length +=1;
//               if(length === followLength){
//                 res.render('users', {
//                   title: 'Friends',
//                   users: array,
//                   user: req.user
//                 });
//               }
//             }
//           });
//         }
//       } else {
//         res.redirect('/auth/home');
//       }
//     }
//   });
// });

/* GET User */
router.get('/:username', isAuthenticated, function(req, res) {
  User.findOne({
    username: req.params.username
  })
  .select('-password')
  .exec(function(error, otherUser) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end()
    }

    Spaces.find({
      _creator: req.params.username
    })
    .sort('-postedAt')
    .exec( function(error, statusList) {
      if (error) {
        console.log(error);
        res.status(404);
        res.end();
      }

      Picture.find({
        _creator: req.params.username
      })
      .sort('-postedAt')
      .exec( function(error, pictures) {
        if (error) {
          console.log(error);
          res.status(404);
          res.end();
        }
        res.send({pictures: pictures, spaces: spaces, otherUser:otherUser})
      });
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


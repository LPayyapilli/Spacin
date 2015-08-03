var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Picture = require('../models/picture.js');


/* Authenticates User */
var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  } else {
    res.status(401);
    res.end();
  }
}


/* DELETE user */
  router.delete('/user', isAuthenticated, function(req, res) {
    User.remove({
        username: req.user.username
      },
      function(error) {
        if (error) {
          console.error(error);
          res.status(404);
          res.end();
        }
        res.status(204);
        res.end();
      });
  });

/* Delete Space */
router.delete('/space/:spaceID', isAuthenticated, function(req, res) {
  Space.remove({
    _id: req.params.spaceID
  })
  .exec(function(error) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    res.status(204);
    res.end();
  });
});


module.exports = router

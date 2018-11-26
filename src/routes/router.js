var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Sessions = require('../models/Sessions');
var path = require('path');

var _path = path.join(__dirname + '/../' + '/views/');
console.log(_path);


router.get('/', (req, res) => {
      if (!req.session.userId) {
        display = {
          email: "Guest"
        };
        res.render(_path + "index.pug", display);
      } else {
        User.findById(req.session.userId, (err, user) => {
          display = {
            email: user.email
          };
          res.render(_path + "index.pug", display);
        });
      }
});

router.get('/signup', (req, res, next) => {
  res.render(_path + "signup.pug");
});

//handle user registration
router.post('/signup', (req, res, next) => {
  if(req.body.email && req.body.password) {
    is_tutor = false;
    default_rate = 0.00;
    if(req.body.tutorCheck === 'Yes') {
      is_tutor = true;
      if(req.body.defaultRate) {
         default_rate = req.body.defaultRate;
      }
    }
    var userData = {
        email: req.body.email,
        password: req.body.password,
        is_tutor: is_tutor,
        default_rate: default_rate,
        tutoring_specialties: req.body.specialites,
        education: req.body.education
    };
    var new_user = new User(userData);
    new_user.save( (error) => {
      if(error) {
        return next(error);
      }});
    res.redirect('/login');
  };
});

//handle authentication
router.get('/login', (req, res, next) => {
  res.render(_path + "login.pug");
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if(err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});

router.post('/login', (req, res, next) => {
    if(req.body.email && req.body.password) {
      User.authenticate(req.body.email, req.body.password, (error, user) => {
         if(error || !user) {
           var err = new Error("Wrong email or password.");
           err.status = 401;
           return next(err);
         } else {
           req.session.userId = user._id;
           display = {
             email: user.email,
           }
           return res.render(_path + "index.pug", display);
        }
    });
  }
});

//destroy session for user logout
router.get('/logout', (req, res, next) => {
  if(req.session) {
    req.session.destroy( (err) => {
      if(err) {
        return(next(err));
      } else {
        return res.redirect("/");
      }
    });
  }
});

router.get('/workspace', (req, res, next) => {
  Sessions.find({}, (err, data) => {
    if(err) {
      return(next(err));
    } else {
      display = {
        logged_in:data.length
      };
      res.render(_path + "workspace.pug", display);
    }
  });
});

module.exports = router;

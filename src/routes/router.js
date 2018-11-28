var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Sessions = require('../models/Sessions');
var path = require('path');

var _path = path.join(__dirname + '/../' + '/views/');

router.get('/account', (req, res, next) => {
  if (!req.session.userId) {
    display = {
      welcome_msg: "Please Log In",
      logged_in: false
    }
    res.render(_path + "account.pug", display);
  } else {
    User.findById(req.session.userId, (err, user) => {
      display = {
        logged_in: true,
        welcome_msg: "Hi " + user.name,
        default_rate: user.default_rate,
        specialties: user.tutoring_specialties
      }
      res.render(_path + "account.pug", display);
    });
  }
});

router.post('/account', (req, res, next) => {
  if(req.session.userId) {
    var userData = {
        default_rate: req.body.defaultRate
    };
    User.findOneAndUpdate({'_id':req.session.userId}, userData, {new:true}, (err, user) => {
      if (err) {
        next(err);
      }
      display = {
        logged_in: true,
        welcome_msg: "Account Updated Successfully!",
        default_rate: user.default_rate
      }
      req.session.defaultRate = user.default_rate;
      return res.render(_path + "account.pug", display);
    });
  } else {
    return res.redirect("/account");
  }

});


router.get('/', (req, res) => {
      if (!req.session.userId) {
        display = {
          email: "Guest"
        };
        res.render(_path + "index.pug", display);
      } else {
        User.findById(req.session.userId, (err, user) => {
          display = {
            email: user.name
          };
          res.render(_path + "index.pug", display);
        });
      }
});

router.get('/contact', (req, res, next) => {
  res.render(_path + "contact.pug");
});

//TODO: Fix Nested Callback and Refactor
router.post('/tutors', (req,res, next) => {
  Sessions.find({}, (err, data) => {
    if(err) {
      return(next(err));
    } else {
        tutor_list = [];
        logged_in = 0;
        if(data.length > 0) {
           logged_in = data.length;
           for (sess in data) {
               /**
                Calculate Rate data from the Tutor's default rate
                rate = tutors's minute default rate * user's expected time selection
               **/
               rate_per_min = JSON.parse(data[sess]._doc.session).defaultRate / 30;
               if (req.body.time_sessions === 'NaN') {
                 rate = 'contact for hourly rate';
               } else {
                 rate = '$' + (rate_per_min * req.body.time_sessions);
               }

              // Match the user's topic with tutor's specialties
              check = JSON.parse(data[sess]._doc.session).userSpecialties;
              if (typeof check === 'string') {
                tutoring_specialties = [check];
              } else {
                tutoring_specialties = check;
              }
              if (req.body.specialties) {
                user_topic = req.body.specialties
                if (tutoring_specialties.includes(user_topic)) {
                     tutor_list.push({
                        "userName":JSON.parse(data[sess]._doc.session).userName,
                        "defaultRate": rate,
                        "userSpecialties": tutoring_specialties
                     });
                }
              }
           }
        }
        res.render(_path + "tutors.pug", {tutors: tutor_list, logged_in: logged_in});
    }
  });
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
        name: req.body.name,
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
           req.session.userName = user.name;
           req.session.defaultRate = user.default_rate;
           req.session.userSpecialties = user.tutoring_specialties;
           display = {
             email: user.name
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

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Sessions = require('../models/Sessions');
var path = require('path');

var _path = path.join(__dirname + '/../' + '/views/');
console.log(_path);

/*
User.find({ '_id': { %in:
   mongoose.Types.ObjectId()
 }
});
*/

//TODO: Fix Nested Callbacks
router.post('/tutors', (req,res, next) => {
  //console.log(req.body)
  Sessions.find({}, (err, data) => {
    if(err) {
      return(next(err));
    } else {
        //console.log(data);
        //console.log(data.length);
        if(data.length > 0) {
           tutor_list = []
           //console.log(data);
           //console.log(typeof data);
           for( sess in data) {
             tutor_list.push({
                "userName":JSON.parse(data[sess]._doc.session).userName,
                "defaultRate": JSON.parse(data[sess]._doc.session).defaultRate,
                "userSpecialties":JSON.parse(data[sess]._doc.session).userSpecialties
             });
           }
           console.log({tutors: tutor_list});
        } else {
           console.log("no sessions");
        }

        res.render(_path + "tutors.pug", {tutors: tutor_list});
    }
  });
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

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var path = require('path');

var _path = path.join(__dirname + '/../' + '/views/');
console.log(_path);

router.get('/', (req, res) => {
  res.sendFile(_path + "index.html");
});

router.get('/signup', (req, res, next) => {
  res.sendFile(_path + "signup.html");
});

//handle registration
router.post('/signup', (req, res, next) => {
  res.sendFile(_path + "index.html");
  if(req.body.email && req.body.password) {
    is_tutor = false;
    default_rate = 0.00;
    if(req.body.tutorCheck) {
      is_tutor = true;
      if(req.body.defaultRate) {
         default_rate = req.body.defaultRate;
      }
    }

    var userData = {
        email: req.body.email,
        password: req.body.password,
        is_tutor: is_tutor,
        default_rate: default_rate
    };
    
    User.create(userData, (error, user) => {
      if(error) {
        return next(error);
      }else {
        return res.redirect('/')
      }
    });
  };
});

module.exports = router;
/*
app.get('/', (req, res) => {
  res.sendFile(_path + "index.html");
});
app.get('/account', (req, res) => {
  res.sendFile(_path + "account.html");
});
app.get('/signup', (req, res) => {
  res.sendFile(_path + "signup.html");
});
app.get('/about', (req, res) => {
  res.sendFile(_path + "about.html");
});
app.post('/signup', (req, res) => {

  res.sendFile(_path + "index.html");
});
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
   email: {
     type: String,
     unique: true,
     required: true,
     trim: true
   },
   password: {
     type: String,
     unique: false,
     required: true,
     trim: true
   },
   is_tutor: {
     type: Boolean,
     required: true
   },
   default_rate: {
     type: Number,
     required: true,
     min: 0.0,
     max: 100
   },
   education: {
     type: String,
     trim: true
   },
   tutoring_specialties: {
     type: [String]
   }
});

UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({email: email}).exec( (err, user) => {
    if(err) {
      return callback(err)
    } else if (!user) {
      var err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    }
    if(user.password === password) {
      return callback(null, user);
    } else {
      return callback();
    }
  });
};

var User = mongoose.model('User', UserSchema);
module.exports = User;

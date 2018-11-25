var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
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
     required: true
   }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;

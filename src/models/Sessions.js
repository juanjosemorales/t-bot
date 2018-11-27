var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionSchema = new Schema(
  {
    expires: String,
    session: String
  },
  {
    collection: 'sessions'
  }
);

var Sessions = mongoose.model('Sessions', SessionSchema);
module.exports = Sessions;

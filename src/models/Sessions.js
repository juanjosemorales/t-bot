var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionSchema = new Schema(
  {
    id: String,
    expires: String
  },
  {
    collection: 'sessions'
  }
);

var Sessions = mongoose.model('Sessions', SessionSchema);
module.exports = Sessions;

require('dotenv').config({path:'variables.env'});
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express()
const port = 5000;
app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true }));

//MongoDB Connection
var mongoConnection = "mongodb://tbot:tbot123@ds151382.mlab.com:51382/tbot";
mongoose.connect(mongoConnection, {useNewUrlParser:true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MonboDB connection error: '));

//Handle Sessions for Logins
app.use(session({
  secret: 'hustle',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

//code for the CHATBOT integration
const verifyWebhook = require('./verify-webhook');
const messageWebhook = require('./message-webhook');
app.get('/bot', verifyWebhook);
app.post('/bot', messageWebhook);

var routes = require('./routes/router');
app.use('/', routes);

//catch 404 and forward to error handler
app.use((req,res,next) => {
  var err = new Error('404 - Not Found');
  err.status = 404;
  next(err);
});

//error handler
app.use( (err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});




app.listen(port, ()=> console.log("Express server on port: " + port))

require('dotenv').config({path:'variables.env'});
const express = require('express');
const bodyParser = require('body-parser');
//const verifyWebhook = require('./verify-webhook');
//const messageWebhook = require('./message-webhook');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express()
const port = 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true }));

//MongoDB Connection
var mongoConnection = "mongodb://localhost:27017/tbot";
mongoose.connect(mongoConnection, {useNewUrlParser:true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MonboDB connection error: '));

//Handle Sessions for Logins


//code for the CHATBOT integration
//app.get('/bot', verifyWebhook);
//app.post('/bot', messageWebhook);

var routes = require('./routes/router');
app.use('/', routes);




app.listen(port, ()=> console.log("Express server on port: " + port))

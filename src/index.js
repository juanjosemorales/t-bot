require('dotenv').config({path:'variables.env'});
const express = require('express');
const bodyParser = require('body-parser');
const verifyWebhook = require('./verify-webhook');
const messageWebhook = require('./message-webhook');

const app = express()
const port = 5000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true }))


//code for the chatbot integration
app.get('/bot', verifyWebhook);
app.post('/bot', messageWebhook);

//code for the web app
var _path =  __dirname + '/views/';
console.log(_path);
app.get('/', (req, res) => {
  res.sendFile(_path + "index.html");
});
app.get('/account', (req, res) => {
  res.sendFile(_path + "account.html");
});
app.get('/contact', (req, res) => {
  res.sendFile(_path + "contact.html");
});
app.get('/about', (req, res) => {
  res.sendFile(_path + "about.html");
});

app.listen(port, ()=> console.log("Express server on port: " + port))

require('dotenv').config({path:'variables.env'});
const express = require('express');
const bodyParser = require('body-parser');
const verifyWebhook = require('./verify-webhook');
const messageWebhook = require('./message-webhook');

const app = express()
const port = 5000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true }))

app.get('/', verifyWebhook);
app.post('/', messageWebhook);

app.listen(port, ()=> console.log("Express server on port: " + port))

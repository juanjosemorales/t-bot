const request = require('request');

//This comes from the project settings in Dialogflow
const projectId = 'tbot-dd970';
const sessionId = '123456';
const languageCode = 'en-US';

const dialogflow = require('dialogflow');

const config = {
  credentials: {
    private_key: process.env.DIALOGFFLOW_PRIVATE_KEY,
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
  }
};

const sessionClient = new dialogflow.SessionsClient(config);
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const {FACEBOOK_ACCESS_TOKEN} = process.env;


const sendTextmessage = (userId, text) => {
  console.log(userId);
  console.log(text);
  request({
    url:'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: FACEBOOK_ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: userId},
      message: {text},
    }
  });
};

module.exports = (event) => {
  const userId = event.sender.id;
  const message = event.message.text;

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text:message,
        languageCode:languageCode
      },
    },
  };

sessionClient
  .detectIntent(request)
  .then(responses => {
    const result = responses[0].queryResult;
    return sendTextmessage(userId, result.fulfillmentText);
  })
  .catch(err => {
     console.error('ERROR', err);
  });
}

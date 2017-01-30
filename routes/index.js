var express = require('express');
var request = require('request');
var router  = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    title: 'Express-REST-Docker',
    description: 'A simple Boilerplate to build REST API in Express'
  });
});

router.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.FB_VERFICATION_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

router.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        }
        else if(event.postback) {
          receivedPostback(event);
        }
        else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.

    res.json({ recipient:{ id:"USER_ID" }, sender_action:"typing_on" });
  }
});

router.get('/setpersistencemenu', (req, res) => {
  messageData = {
  setting_type : "call_to_actions",
  thread_state : "existing_thread",
  call_to_actions:[
    {
      type:"web_url",
      title:"View blog",
      url:"http://aravindvasudevan.me/blog/"
    },
    {
      type:"postback",
      title:"Random Article",
      payload:"article"
    }
  ]
}
  request({
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: process.env.FB_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
      console.log(body);
  });
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    sendGenericMessage(senderID);

  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message:{
      attachment:{
        type:"template",
        payload:{
          template_type:"button",
          text:"Hello there! How may I help you?",
          buttons:[
            {
              type:"web_url",
              url:"http://aravindvasudevan.me/blog/",
              title:"Go to the blog"
            },
            {
              type:"postback",
              title:"Random Article",
              payload:"article"
            }
          ]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function sendArticle(recipientId) {
  let messageData = {
    recipient:{
      id: recipientId
    },
    message:{
      attachment:{
        type:"template",
        payload:{
          template_type:"generic",
          elements:[
             {
              title:"Web Scraping 101 : Build a simple web scraper using PHP",
              image_url:"http://aravindvasudevan.me/public/images/web_scraping.jpg",
              subtitle:"First, we have to pull the content off the Wikipedia page...",
              buttons:[
                {
                  type:"web_url",
                  url:"http://aravindvasudevan.me/2017/01/13/web-scraping-101/",
                  title:"read article"
                }
              ]
            }
          ]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.FB_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
    sendArticle(senderID);
  // sendTextMessage(senderID, payload);
}

module.exports = router;

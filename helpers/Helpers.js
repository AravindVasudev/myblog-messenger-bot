"use strict";

const request = require('request');

module.exports = class Helpers {

  static receivedMessage(event) {
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
        messageTextSmall = messageText.toLowerCase();
      // If we receive a text message, check to see if it matches a keyword
      // and send back the example. Otherwise, just echo the text we received.
      switch (messageTextSmall) {
        case 'generic':
          this.sendTextMessage(senderID, 'hey, wierdo');
          break;

        default:
          this.sendGenericMessage(senderID);
      }
    } else if (messageAttachments) {
      this.sendTextMessage(senderID, "Message with attachment received");
    }
  }

  static sendTextMessage(recipientId, messageText) {
    console.log('SEND TEST MESSAGE IS CALLED!')
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText
      }
    };

    this.callSendAPI(messageData);
  }

  static callSendAPI(messageData) {
    console.log('SEND TEST MESSAGE IS CALLED!')
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

  static receivedPostback(event) {
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
    this.sendTextMessage(senderID, "Postback called");
  }
}

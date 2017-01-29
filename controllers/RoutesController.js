/*
 * Singleton Routes class
 *
 */

 const Helpers = require('../helpers/Helpers');

let instance = null;

module.exports = class Routes {
  constructor() {
    if(!instance)
      instance = this;

    return instance;
  }

  getIndex(req, res) {
    res.send('Welcome to the site, stranger!');
  }

  getWebhook(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.FB_VERFICATION_TOKEN) {
      console.log("Validating webhook");
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error("Failed validation. Make sure the validation tokens match.");
      res.sendStatus(403);
    }
  }

  postWebhook(req, res) {
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
            Helpers.receivedMessage(event);
          } else {
            console.log("Webhook received unknown event: ", event);
          }
        });
      });

      // Assume all went well.
      //
      // You must send back a 200, within 20 seconds, to let us know
      // you've successfully received the callback. Otherwise, the request
      // will time out and we will keep trying to resend.
      res.sendStatus(200);
    }
  }
}

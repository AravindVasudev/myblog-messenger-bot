var express = require('express');
var router = express.Router();

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
  console.log('hi');
});

function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  console.log("Message data: ", event.message);
}

module.exports = router;

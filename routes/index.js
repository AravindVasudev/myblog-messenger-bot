const express          = require('express');
const RoutesController = require('../controllers/RoutesController');
const routes           = new RoutesController();
const router           = express.Router();
const request = require('request');

/* GET home page. */
router.get('/', routes.getIndex);

// Facebook webhook verification
router.get('/webhook', routes.getWebhook);

// Called by facebook when event occurs
router.post('/webhook', routes.postWebhook);


module.exports = router;

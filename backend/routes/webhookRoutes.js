const express = require('express');
const webhookController = require('../controllers/webhookController');

const router = express.Router();

router.post('/meta', webhookController.meta);
router.post('/google', webhookController.google);
router.post('/whatsapp', webhookController.whatsapp);
router.post('/indiamart', webhookController.indiamart);

module.exports = router;

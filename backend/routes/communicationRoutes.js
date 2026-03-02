const express = require('express');
const communicationController = require('../controllers/communicationController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/templates', communicationController.templates);
router.post('/templates', communicationController.createTemplate);
router.get('/queue', communicationController.queue);
router.get('/delivery-report', communicationController.deliveryReport);
router.post('/send', communicationController.send);

module.exports = router;

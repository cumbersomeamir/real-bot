const express = require('express');
const futureController = require('../controllers/futureController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/future/:feature', futureController.getFeature);

module.exports = router;

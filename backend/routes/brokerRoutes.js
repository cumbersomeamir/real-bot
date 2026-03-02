const express = require('express');
const brokerController = require('../controllers/brokerController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', brokerController.list);
router.get('/leaderboard', brokerController.leaderboard);
router.get('/:id', brokerController.getById);
router.get('/:id/leads', brokerController.leads);
router.get('/:id/performance', brokerController.performance);

module.exports = router;

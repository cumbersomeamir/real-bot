const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/overview', analyticsController.overview);
router.get('/funnel', analyticsController.funnel);
router.get('/revenue', analyticsController.revenue);
router.get('/campaigns', analyticsController.campaigns);
router.get('/sources', analyticsController.sources);
router.get('/brokers', analyticsController.brokers);
router.get('/forecast', analyticsController.forecast);
router.get('/leakage', analyticsController.leakage);

module.exports = router;

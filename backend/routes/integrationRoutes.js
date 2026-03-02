const express = require('express');
const integrationController = require('../controllers/integrationController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/future/ai-chat-assistant', integrationController.futureFeature);
router.get('/future/webhook-builder', integrationController.futureFeature);
router.get('/future/report-builder', integrationController.futureFeature);
router.get('/future/multilanguage', integrationController.futureFeature);
router.get('/future/mobile-shell', integrationController.futureFeature);
router.get('/future/channel-partner-portal', integrationController.futureFeature);
router.get('/future/client-portal', integrationController.futureFeature);
router.get('/future/ai-price-optimization', integrationController.futureFeature);
router.get('/future/demand-heatmap', integrationController.futureFeature);
router.get('/future/ad-optimizer', integrationController.futureFeature);
router.get('/future/sell-through-predictor', integrationController.futureFeature);
router.get('/future/document-generation', integrationController.futureFeature);
router.get('/future/payment-tracking', integrationController.futureFeature);
router.get('/future/chatbot-builder', integrationController.futureFeature);
router.get('/future/api-marketplace', integrationController.futureFeature);

module.exports = router;

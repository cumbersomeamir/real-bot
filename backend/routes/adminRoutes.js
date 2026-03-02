const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/settings', adminController.settings);
router.put('/settings', adminController.updateSettings);
router.get('/team', adminController.team);
router.post('/team/invite', adminController.invite);
router.put('/team/:id/role', adminController.changeRole);
router.get('/audit-logs', adminController.auditLogs);
router.get('/api-keys', adminController.apiKeys);
router.post('/api-keys', adminController.createApiKey);

module.exports = router;

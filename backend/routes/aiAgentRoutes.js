const express = require('express');
const aiAgentController = require('../controllers/aiAgentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', aiAgentController.list);
router.get('/:type', aiAgentController.getByType);
router.put('/:type/config', aiAgentController.updateConfig);
router.post('/:type/toggle', aiAgentController.toggle);
router.get('/:type/logs', aiAgentController.logs);
router.post('/qualification/run/:leadId', aiAgentController.runQualification);
router.post('/reactivation/campaign', aiAgentController.startReactivation);

module.exports = router;

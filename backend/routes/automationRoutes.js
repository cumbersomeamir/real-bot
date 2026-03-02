const express = require('express');
const automationController = require('../controllers/automationController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', automationController.list);
router.post('/', automationController.create);
router.put('/:id', automationController.update);
router.delete('/:id', automationController.remove);
router.post('/:id/test', automationController.test);
router.get('/:id/history', automationController.history);

module.exports = router;

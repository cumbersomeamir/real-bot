const express = require('express');
const leadController = require('../controllers/leadController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', leadController.list);
router.get('/:id', leadController.getById);
router.post('/', leadController.create);
router.put('/:id', leadController.update);
router.delete('/:id', leadController.remove);
router.post('/import', leadController.importCSV);
router.post('/:id/assign', leadController.assign);
router.post('/:id/qualify', leadController.qualify);
router.post('/:id/score', leadController.score);
router.get('/:id/timeline', leadController.timeline);
router.get('/:id/communications', leadController.communications);
router.post('/bulk-action', leadController.bulkAction);

module.exports = router;

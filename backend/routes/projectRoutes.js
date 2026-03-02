const express = require('express');
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', projectController.list);
router.get('/:id', projectController.getById);
router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.get('/:id/inventory', projectController.inventory);
router.put('/:id/inventory/:unitId', projectController.updateInventory);

module.exports = router;

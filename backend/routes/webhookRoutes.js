const express = require('express');
const { success } = require('../utils/response');

const router = express.Router();

router.post('/meta', (req, res) => res.json(success({}, 'Meta webhook processed')));
router.post('/google', (req, res) => res.json(success({}, 'Google webhook processed')));
router.post('/whatsapp', (req, res) => res.json(success({}, 'WhatsApp webhook processed')));
router.post('/indiamart', (req, res) => res.json(success({}, 'IndiaMART webhook processed')));

module.exports = router;

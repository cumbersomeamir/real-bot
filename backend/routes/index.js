const express = require('express');

const authRoutes = require('./authRoutes');
const leadRoutes = require('./leadRoutes');
const brokerRoutes = require('./brokerRoutes');
const projectRoutes = require('./projectRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const automationRoutes = require('./automationRoutes');
const communicationRoutes = require('./communicationRoutes');
const integrationRoutes = require('./integrationRoutes');
const aiAgentRoutes = require('./aiAgentRoutes');
const webhookRoutes = require('./webhookRoutes');
const adminRoutes = require('./adminRoutes');
const futureRoutes = require('./futureRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/brokers', brokerRoutes);
router.use('/projects', projectRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/rules', automationRoutes);
router.use('/communications', communicationRoutes);
router.use('/integrations', integrationRoutes);
router.use('/agents', aiAgentRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/future', futureRoutes);
router.use('/', adminRoutes);

module.exports = router;

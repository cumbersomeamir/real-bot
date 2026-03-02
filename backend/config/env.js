const Joi = require('joi');
require('dotenv').config();

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().default(5000),
  MONGODB_URI: Joi.string().required(),
  REDIS_URL: Joi.string().allow('').optional(),
  QUEUE_MODE: Joi.string().valid('bullmq', 'polling').optional(),
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_EXPIRY: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRY: Joi.string().default('7d'),
  FRONTEND_URL: Joi.string().default('http://localhost:3000'),
  ENCRYPTION_KEY: Joi.string().allow('').optional()
}).unknown();

const { value, error } = schema.validate(process.env, { abortEarly: false });

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

// Derived defaults
if (!value.QUEUE_MODE) {
  value.QUEUE_MODE = value.REDIS_URL ? 'bullmq' : 'polling';
}

module.exports = value;

const Joi = require('joi');
const { failure } = require('../utils/response');

function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      return res.status(400).json(failure('VALIDATION_ERROR', error.message, error.details));
    }
    return next();
  };
}

module.exports = { validate, Joi };

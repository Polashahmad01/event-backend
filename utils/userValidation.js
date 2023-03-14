const Joi = require("joi")

const schema = Joi.object({
  firstName: Joi.string()
    .required(),
  lastName: Joi.string()
    .required()
})

module.exports = schema

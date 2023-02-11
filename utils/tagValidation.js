const Joi = require("joi")

const schema = Joi.object({
  tagName: Joi.string()
    .min(3)
    .max(50)
    .required(),
  tagDescription: Joi.string()
    .min(10)
    .max(100)
    .required()
})

module.exports = schema

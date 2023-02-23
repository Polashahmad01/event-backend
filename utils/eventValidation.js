const Joi = require("joi")

const schema = Joi.object({
  title: Joi.string()
    .min(10)
    .max(150)
    .required(),
  author: Joi.string()
    .min(3)
    .max(20)
    .required(),
  eventType: Joi.string()
    .required(),
  tags: Joi.array()
    .required(),
  contentUrl: Joi.string()
    .required(),
  summary: Joi.string()
    .min(10)
    .max(50)
    .required(),
  description: Joi.string()
    .min(10)
    .max(300)
    .required(),
  isSaved: Joi.boolean()
    .required(),
  isPublished: Joi.boolean()
  .required(),
  isUnPublished: Joi.boolean()
    .required(),
  imageUrl: Joi.string(),
  status: Joi.string()
    .required(),
  createdAt: Joi.date()
    .required()
})

module.exports = schema
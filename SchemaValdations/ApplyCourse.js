const joi = require("joi");

const Schemas = {
  Data: joi.object({
    user_id: joi.string().required(),
    course_id: joi.string().required(),
  }),
};

module.exports = Schemas;

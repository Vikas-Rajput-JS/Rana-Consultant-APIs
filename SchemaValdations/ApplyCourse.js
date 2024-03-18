const joi = require("joi");

const Schemas = {
  Data: joi.object({
    user_id: joi.string().required(),
    course_id: joi.string().required(),
    courseName: joi.string().required(),
    userName: joi.string().required(),
    price: joi.number().required(),
  }),
};

module.exports = Schemas;

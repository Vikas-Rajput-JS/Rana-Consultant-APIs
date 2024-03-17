const joi = require("joi");

const Schemas = {
  Data: joi.object({
    user_id: joi.string().required(),
    course_id: joi.string().required(),
    cardHolder: joi.string().required(),
    cardNo: joi.string().required(),
    cvc: joi.string().required(),
    expiryMonth: joi.string().required(),
    expiryYear: joi.string().required(),
    price: joi.number().required(),
    address: joi.string().required(),
    city: joi.string(),
    state: joi.string(),
    country: joi.string(),
    pincode: joi.string(),
  }),
};

module.exports = Schemas;

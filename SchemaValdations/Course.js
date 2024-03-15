const joi = require("joi");

const Schemas = {
  Data: joi.object({
    name: joi.string().required(),
    startDate: joi.string().required(),
    endDate: joi.required(),
    price: joi.number().required(),

    collegeName: joi.string().required(),
    address: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    country: joi.string().required(),
    pincode: joi.string().required(),
    registrationFees: joi.number().required(),
  }),
};


module.exports = Schemas;
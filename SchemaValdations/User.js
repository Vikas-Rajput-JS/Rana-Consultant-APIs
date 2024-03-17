const joi = require("joi");

const Schemas = {
  Data: joi.object({
    firstName: joi.string().required(),
    lastName: joi.string(),
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    mobileNo: joi.number(),
    dialCode: joi.number(),
    address: joi.string().required(),
    city: joi.string(),
    state: joi.string(),
    country: joi.string(),
    pincode: joi.string(),

    lat: joi.number(),
    lng: joi.number(),
    image: joi.string(),
  }),
};

module.exports = Schemas;

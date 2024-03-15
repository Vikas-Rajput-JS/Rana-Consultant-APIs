const joi = require("joi");

const ValidationResult = (data) => {
  return (req, res, next) => {
    const { error } = data.validate(req.body);
    const valid = error == null;
    console.log(error);
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details?.map((i) => i.message);

      res.status(400).send({
        success: false,
        status: 400,
        message: message[0],
      });
    }
  };
};

module.exports = ValidationResult;

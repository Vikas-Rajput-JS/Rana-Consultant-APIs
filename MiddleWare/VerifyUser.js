const jwt = require("jsonwebtoken");

const SECRET_KEY =
  "Nikk.Vikas@95181!Hisar###$B(&^$&^%$&^%&$arwala^9~1@@'Delhi_4947948Har(&%&^*$*^%#&$%yana_$$&&India&^7658765865^%&*^%#$@^$#@#$&%^#@#@&%#$^";
const VerifyUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(400).send({ message: "Auth Token Required.", success: false });
  }
  try {
    const VerifyToken = jwt.verify(token, SECRET_KEY);

    req.user = VerifyToken.user;
    next();
  } catch (error) {
    if (error.expiredAt) {
      res
        .status(401)
        .send({
          code: 500,
          status: false,
          message: "Your session is Expired.",
        });
    }

    res.status(501).json({ error: "Please Login Using Valid Auth Token" });
  }
};

module.exports = VerifyUser
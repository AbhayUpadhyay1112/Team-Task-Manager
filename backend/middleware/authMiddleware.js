const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

  try {

    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json("Access denied");
    }

    // REMOVE "Bearer "
    const token = authHeader.split(" ")[1];

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = verified;

    next();

  } catch (err) {

    console.log(err);

    res.status(400).json("Invalid token");
  }
};
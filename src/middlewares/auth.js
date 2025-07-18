const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async function (req, res, next) {
  try {
    const token = req.cookies.token; // requires cookie-parser middleware

    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }

    const decoded = jwt.verify(token, "your_jwt_secret");

    if (!decoded || !decoded.userId) {
      return res.status(401).send("Unauthorized: Invalid token");
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    req.user = user; // attach user to req
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).send("Unauthorized: Invalid token");
  }
};

module.exports = { userAuth };


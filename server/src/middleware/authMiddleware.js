// server/src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({
          message: "Authentication failed: No Authorization header provided",
        });
    }

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication failed: Token missing from header" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userData = { userId: decodedToken.userId, role: decodedToken.role };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Authentication failed: Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Authentication failed: Token expired" });
    }
    return res
      .status(500)
      .json({ message: "Authentication failed: Internal server error" });
  }
};

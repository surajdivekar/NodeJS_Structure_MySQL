// middleware/auth.middleware.js

const jwt = require("jsonwebtoken");
const { APIResponseUtils } = require("../utils/apiResponse/apiResponse");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return APIResponseUtils.sendUnauthorizedResponse(res, "No token provided");
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return APIResponseUtils.sendUnauthorizedResponse(res, "Token error");
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return APIResponseUtils.sendUnauthorizedResponse(res, "Token malformatted");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return APIResponseUtils.sendUnauthorizedResponse(res, "Invalid token");
    }

    req.authorId = decoded.id;
    return next();
  });
};

module.exports = authMiddleware;

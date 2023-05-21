// Import jsonwebtoken.
const jwt = require("jsonwebtoken");

// Import User model.
const User = require("../models/user");

// Import helper function: sendError.
const { sendError } = require("../utils/helper");

// An authentication middleware function to check
// if a request is coming from an authenticated user.
// Ensure that a request is coming from an authenticated
// user by verifying the JWT token,
// checking the user's existence, and
// attaching the user object to the request.
exports.isAuth = async (req, res, next) => {
  const token = req.headers?.authorization;

  if (!token) {
    return sendError(res, "Invalid JWT token!");
  }

  const jwtToken = token.split("Bearer ")[1];

  if (!jwtToken) {
    return sendError(res, "Invalid JWT token!");
  }

  const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);

  const { userId } = decode;

  const user = await User.findById(userId);

  if (!user) {
    return sendError(res, "Unauthorized access!");
  }

  req.user = user;

  next();
};

// Check if the authenticated user has Admin privileges.
exports.isAdmin = async (req, res, next) => {
  const { user } = req;
  if (user.role !== "admin") {
    return sendError(res, "Unauthorized access!");
  }

  next();
};

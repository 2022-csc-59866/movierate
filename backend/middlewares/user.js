// Import PasswordResetToken model.
const PasswordResetToken = require("../models/passwordResetToken");
// Import isValidObjectId.
const { isValidObjectId } = require("mongoose");
// Import helper function sendError.
const { sendError } = require("../utils/helper");

// Validate a password reset token and user ID.
exports.isValidPassResetToken = async (req, res, next) => {
  const { token, userId } = req.body;

  if (!token.trim() || !isValidObjectId(userId)) {
    return sendError(res, "Invalid request!");
  }
  const resetToken = await PasswordResetToken.findOne({ owner: userId });

  if (!resetToken) {
    return sendError(res, "Unauthorized access, invalid request!");
  }

  const matched = await resetToken.compareToken(token);

  if (!matched) {
    return sendError(res, "Unauthorized access, invalid request!");
  }

  req.resetToken = resetToken;
  next();
};

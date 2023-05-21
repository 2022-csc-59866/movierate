// Import mongoose.
const mongoose = require("mongoose");
// Import bcrypt.
const bcrypt = require("bcrypt");

// PasswordResetTokenSchema model/schema.
const passwordResetTokenSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 600, // 600 seconds = 10 minutes.
    default: Date.now(),
    required: true,
  },
});

passwordResetTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }

  next();
});

passwordResetTokenSchema.methods.compareToken = async function (token) {
  const result = await bcrypt.compare(token, this.token);
  return result;
};

module.exports = mongoose.model("PasswordResetToken", passwordResetTokenSchema);

// Import mongoose.
const mongoose = require("mongoose");
// Import bcrypt.
const bcrypt = require("bcrypt");

// Generate a ranom number
const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// User model/schema.
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      default: () => `User${generateRandomNumber(1, 10000)}`,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      default: () => `Email${generateRandomNumber(1, 10000)}`,
    },
    password: {
      type: String,
      required: false,
      default: "",
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["admin", "user"],
    },
    googleId: {
      type: String,
      required: false,
      default: "",
    },
    githubId: {
      type: String,
      required: false,
      default: "",
    },
  },
  { timestamps: true } // Filter users by createdAt.
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

userSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

module.exports = mongoose.model("User", userSchema);

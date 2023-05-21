// Import mongoose.
const mongoose = require("mongoose");

// Actor model/schema.
const actorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    about: {
      type: String,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      trim: true,
      required: true,
    },
    profile: {
      type: Object,
      url: String,
      public_id: String,
    },
    died: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Filter actors by createdAt.
);

actorSchema.virtual("age").get(function () {
  const birthDate = new Date(this.dob);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - birthDate.getFullYear();

  const monthDiff = currentDate.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
});

actorSchema.index({ name: "text" });

module.exports = mongoose.model("Actor", actorSchema);

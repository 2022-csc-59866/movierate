// Import mongoose.
const mongoose = require("mongoose");
// Import available genres.
const genres = require("../utils/genres");

// Movie model/schema.
const movieSchema = mongoose.Schema(
  {
    poster: {
      type: Object,
      url: { type: String, required: true },
      public_id: { type: String, required: true },
      responsive: [URL],
    },
    trailer: {
      type: Object,
      url: { type: String, required: true },
      public_id: { type: String, required: true },
      // required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    storyLine: {
      type: String,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    genres: {
      type: [String],
      required: true,
      enum: genres,
    },
    tags: {
      type: [String],
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Public", "Private"],
    },
    directors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Actor",
      },
    ],
    writers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Actor",
      },
    ],
    cast: [
      {
        actor: { type: mongoose.Schema.Types.ObjectId, ref: "Actor" },
        roleAs: String,
        leadActor: Boolean,
      },
    ],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    language: {
      type: String,
      required: true,
    },
    filmRating: {
      type: String,
      enum: ["G", "PG", "PG-13", "R", "NC-17", "NR"],
      required: true,
      // G     = General Audiences
      // PG    = Parental Guidance
      // PG-13 = Parental Strongly Cautioned
      // R     = Restricted
      // NC-17 = No One 17 And Under Admitted
      // NR    = Not Rated
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);

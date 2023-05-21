//Import crypto.
const crypto = require("crypto");
//Import cloudinary configurations.
const cloudinary = require("../cloud");
// Import Review model.
const Review = require("../models/review");

// Send error message.
exports.sendError = (res, error, statusCode = 401) =>
  res.status(statusCode).json({ error });

// Generate cryptographically strong pseudorandom data.
exports.generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) reject(err);
      const buffString = buff.toString("hex");

      resolve(buffString);
    });
  });
};

// Send error message.
exports.handleNotFound = (req, res) => {
  this.sendError(res, "Not found!", 404);
};

// Upload image to Cloudinary.
exports.uploadImageToCloud = async (file) => {
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file,
    { gravity: "face", height: 500, width: 500, crop: "thumb" }
  );

  return { url, public_id };
};

// Format Actor data in JSON fromat to be return to the frontend.
exports.formatActor = (actor) => {
  const { _id, name, dob, about, gender, profile, age, died } = actor;
  return {
    id: _id,
    name,
    dob,
    about,
    gender,
    profile: profile?.url,
    age,
    died,
  };
};

// Format User data in JSON fromat to be return to the frontend.
exports.formatUser = (user) => {
  const { _id, name, email, role, googleId, githubId } = user;
  return {
    id: _id,
    name,
    email,
    role,
    googleId,
    githubId,
  };
};

// Parse data in the request body from JSON strings to JavaScript objects.
exports.parseData = (req, res, next) => {
  const { trailer, genres, tags, directors, writers, cast } = req.body;

  if (trailer) {
    req.body.trailer = JSON.parse(trailer);
  }
  if (genres) {
    req.body.genres = JSON.parse(genres);
  }
  if (tags) {
    req.body.tags = JSON.parse(tags);
  }
  if (directors) {
    req.body.directors = JSON.parse(directors);
  }
  if (writers) {
    req.body.writers = JSON.parse(writers);
  }
  if (cast) {
    req.body.cast = JSON.parse(cast);
  }

  next();
};

// Calculate average rating.
exports.averageRatingPipeline = (movieId) => {
  return [
    {
      $lookup: {
        from: "Review",
        localField: "rating",
        foreignField: "_id",
        as: "avgRat",
      },
    },
    {
      $match: { parentMovie: movieId },
    },
    {
      $group: {
        _id: null,
        ratingAvg: {
          $avg: "$rating",
        },
        reviewCount: {
          $sum: 1,
        },
      },
    },
  ];
};

// Find related movies based on the provided tags and excluding a specific movie with the given movieId.
// Limit to 3.
exports.relatedMovieAggregation = (tags, movieId) => {
  return [
    {
      $lookup: {
        from: "Movie",
        localField: "tags",
        foreignField: "_id",
        as: "relatedMovies",
      },
    },
    {
      $match: {
        tags: { $in: [...tags] },
        _id: { $ne: movieId },
      },
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
      },
    },
    {
      $limit: 3,
    },
  ];
};

// Find the top-rated movies based on criteria.
// Sort in descending order od reviewCount.
// Limit to 3.
exports.topRatedMoviesPipeline = (type) => {
  const matchOptions = {
    reviews: { $exists: true },
    status: { $eq: "Public" },
  };

  if (type) {
    matchOptions.type = { $eq: type };
  }

  return [
    {
      $lookup: {
        from: "Movie",
        localField: "reviews",
        foreignField: "_id",
        as: "topRated",
      },
    },
    {
      $match: matchOptions,
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
        reviewCount: { $size: "$reviews" },
      },
    },
    {
      $sort: {
        reviewCount: -1,
      },
    },
    {
      $limit: 3,
    },
  ];
};

// Get average ratings.
exports.getAverageRatings = async (movieId) => {
  const [aggregatedResponse] = await Review.aggregate(
    this.averageRatingPipeline(movieId)
  );

  const reviews = {};

  if (aggregatedResponse) {
    const { ratingAvg, reviewCount } = aggregatedResponse;

    reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
    reviews.reviewCount = reviewCount;
  }

  return reviews;
};

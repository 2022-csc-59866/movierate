// Import Movie model.
const Movie = require("../models/movie");
// Import Review model.
const Review = require("../models/review");
// Import isValidObjectId.
const { isValidObjectId } = require("mongoose");

//Import helper functions: sendError, getAverageRatings.
const { sendError, getAverageRatings } = require("../utils/helper");

// Controller: addReview.
exports.addReview = async (req, res) => {
  const { movieId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user._id;

  if (!req.user.isVerified) {
    return sendError(res, "Please verify you email first!");
  }

  if (!isValidObjectId(movieId)) {
    return sendError(res, "Invalid Movie!");
  }

  const movie = await Movie.findOne({ _id: movieId, status: "Public" });

  if (!movie) {
    return sendError(res, "Movie not found!", 404);
  }

  const isAlreadyReviewed = await Review.findOne({
    owner: userId,
    parentMovie: movie._id,
  });

  if (isAlreadyReviewed) {
    return sendError(res, "Invalid request, review already exists!");
  }

  const newReview = new Review({
    owner: userId,
    parentMovie: movie._id,
    content,
    rating,
  });

  movie.reviews.push(newReview._id);
  await movie.save();

  await newReview.save();

  const reviews = await getAverageRatings(movie._id);

  res.json({ message: "Review added!", reviews });
};

// Controller: updateReview.
exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user._id;

  if (!isValidObjectId(reviewId)) {
    return sendError(res, "Review ID invalid!");
  }

  const review = await Review.findOne({ owner: userId, _id: reviewId });

  if (!review) {
    return sendError(res, "Review not found!", 404);
  }

  review.content = content;
  review.rating = rating;

  await review.save();

  res.json({ message: "YReview updated!" });
};

// Controller: removeReview.
exports.removeReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(reviewId)) {
    return sendError(res, "Review ID invalid!");
  }

  const review = await Review.findOne({ owner: userId, _id: reviewId });

  if (!review) {
    return sendError(res, "Invalid request, review not found!");
  }

  const movie = await Movie.findById(review.parentMovie).select("reviews");
  movie.reviews = movie.reviews.filter((rId) => rId.toString() !== reviewId);

  await Review.findByIdAndDelete(reviewId);

  await movie.save();

  res.json({ message: "Review removed!" });
};

// Controller: getReviewsByMovie.
exports.getReviewsByMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) {
    return sendError(res, "Movie ID invalid!");
  }

  const movie = await Movie.findById(movieId)
    .populate({
      path: "reviews",
      populate: {
        path: "owner",
        select: "name",
      },
    })
    .select("reviews title");

  const reviews = movie.reviews.map((r) => {
    const { owner, content, rating, _id: reviewID } = r;
    const { name, _id: ownerId } = owner;

    return {
      id: reviewID,
      owner: {
        id: ownerId,
        name,
      },
      content,
      rating,
    };
  });

  res.json({ movie: { reviews, title: movie.title } });
};

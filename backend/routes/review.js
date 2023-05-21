// Create a new instance of the Router class from the Express framework.
const router = require("express").Router();

// Import middleware: isAuth.
const { isAuth } = require("../middlewares/auth");
// Import validators.
const { validateRatings, validate } = require("../middlewares/validator");

// Import controllers.
const {
  addReview,
  updateReview,
  removeReview,
  getReviewsByMovie,
} = require("../controllers/review");

// Method: POST
// Controller: addReview.
// Middlewares: isAuth, validateRatings, validate.
router.post("/add/:movieId", isAuth, validateRatings, validate, addReview);

// Method: PATCH
// Controller: updateReview.
// Middlewares: isAuth, validateRatings, validate.
router.patch("/:reviewId", isAuth, validateRatings, validate, updateReview);

// Method: DELETE
// Controller: removeReview.
// Middlewares: isAuth.
router.delete("/:reviewId", isAuth, removeReview);

// Method: GET
// Controller: getReviewsByMovie.
router.get("/get-reviews-by-movie/:movieId", getReviewsByMovie);

module.exports = router;

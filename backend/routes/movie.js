// Import express.
const express = require("express");
// Import middlewares: isAuth, isAdmin.
const { isAuth, isAdmin } = require("../middlewares/auth");
// Import middlewares: uploadVideo, uploadImage
const { uploadVideo, uploadImage } = require("../middlewares/multer");
// Import controllers.
const {
  uploadTrailer,
  createMovie,
  updateMovieWithoutPoster,
  updateMovie,
  removeMovie,
  getMovies,
  getMovieForUpdate,
  searchMovies,
  getLatestUploads,
  getSingleMovie,
  getRelatedMovies,
  getTopRatedMovies,
  serachPublicMovies,
} = require("../controllers/movie");
// Import validators.
const {
  validateMovie,
  validate,
  validateTrailer,
} = require("../middlewares/validator");
// Import helper function parseData.
const { parseData } = require("../utils/helper");
// Create a new instance of the Router class from the Express framework.
const router = express.Router();

// Method: POST
// Controller: getAppInfo.
// Middlewares: isAuth, isAdmin, uploadVideo.
router.post(
  "/upload-trailer",
  isAuth,
  isAdmin,
  uploadVideo.single("video"),
  uploadTrailer
);

// Method: POST
// Controller: createMovie.
// Middlewares: isAuth, isAdmin, uploadVideo, parseData, validateMovie, validateTrailer, validate.
router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validateTrailer,
  validate,
  createMovie
);

// Dynamic Route with movieId.
// Method: PATCH
// Controller: updateMovie.
// Middlewares: isAuth, isAdmin, uploadVideo, parseData, validateMovie, validateTrailer, validate.
router.patch(
  "/update/:movieId",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validate,
  updateMovie
);

// Dynamic Route with movieId.
// Method: PATCH
// Controller: updateMovieWithoutPoster.
// Middlewares: isAuth, isAdmin, parseData, validateMovie, validate.
router.patch(
  "/update-movie-without-poster/:movieId",
  isAuth,
  isAdmin,
  parseData,
  validateMovie,
  validate,
  updateMovieWithoutPoster
);

// Method: DELETE
// Controller: removeMovie.
// Middlewares: isAuth, isAdmin.
router.delete("/:movieId", isAuth, isAdmin, removeMovie);

// Method: GET
// Controller: getMovies.
// Middlewares: isAuth, isAdmin.
router.get("/movies", isAuth, isAdmin, getMovies);

// Method: GET
// Controller: getMovieForUpdate.
// Middlewares: isAuth, isAdmin.
router.get("/for-update/:movieId", isAuth, isAdmin, getMovieForUpdate);

// Method: GET
// Controller: searchMovies.
// Middlewares: isAuth, isAdmin.
router.get("/search", isAuth, isAdmin, searchMovies);

// Method: GET
// Controller: getLatestUploads.
router.get("/latest-uploads", getLatestUploads);

// Method: GET
// Controller: getSingleMovie.
router.get("/single/:movieId", getSingleMovie);

// Method: GET
// Controller: getRelatedMovies.
router.get("/related/:movieId", getRelatedMovies);

// Method: GET
// Controller: getTopRatedMovies.
router.get("/top-rated", getTopRatedMovies);

// Method: GET
// Controller: serachPublicMovies.
router.get("/search-public", serachPublicMovies);

module.exports = router;

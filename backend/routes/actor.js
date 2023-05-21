// Import express.
const express = require("express");

// Import middleware: uploadImage .
const { uploadImage } = require("../middlewares/multer");
// Import middlewares: isAuth, isAdmin.
const { isAuth, isAdmin } = require("../middlewares/auth");
// Import middlewares: actorInfoValidator, validate.
const { actorInfoValidator, validate } = require("../middlewares/validator");

// Import createActor, updateActor, removeActor, searchActor, getLatestActors, getSingleActor, getActors controllers.
const {
  createActor,
  updateActor,
  removeActor,
  searchActor,
  getLatestActors,
  getSingleActor,
  getActors,
} = require("../controllers/actor");

// Create a new instance of the Router class from the Express framework.
const router = express.Router();

// Method: POST
// Controller: createActor.
// Middlewares: isAuth, isAdmin, uploadImage, actorInfoValidator, validate.
router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("profile"),
  actorInfoValidator,
  validate,
  createActor
);

// Dynamic Route with actorId.
// Method: POST
// Controller: updateActor.
// Middlewares:  isAuth, isAdmin, uploadImage, actorInfoValidator, validate.
router.post(
  "/update/:actorId",
  isAuth,
  isAdmin,
  uploadImage.single("image"),
  actorInfoValidator,
  validate,
  updateActor
);

// Dynamic Route with actorId.
// Method: DELETE
// Controller: removeActor.
// Middlewares: isAuth, isAdmin.
router.delete("/:actorId", isAuth, isAdmin, removeActor);

// Method: GET
// Controller: searchActor.
// Middlewares: isAuth, isAdmin.
router.get("/search", isAuth, isAdmin, searchActor);

// Method: GET
// Controller: getLatestActors.
router.get("/latest-uploads", getLatestActors);

// Method: GET
// Controller: getActors.
// Middlewares: isAuth, isAdmin.
router.get("/actors", isAuth, isAdmin, getActors);

// Method: GET
// Controller: getSingleActor.
router.get("/single/:id", getSingleActor);

module.exports = router;

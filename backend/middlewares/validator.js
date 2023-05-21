// Import check, validationResult.
const { check, validationResult } = require("express-validator");
// Import isValidObjectId.
const { isValidObjectId } = require("mongoose");
// Import availabel movie genres.
const genres = require("../utils/genres");

// Validate user information.
exports.userValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is missing!"),
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long!"),
];

// Validate user password.
exports.validatePassword = [
  check("newPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be 8 to 100 characters!")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/
    )
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character!"
    ),
];

// Validate login information.
exports.signInValidator = [
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
  check("password").trim().not().isEmpty().withMessage("Password is missing!"),
];

// Validate actor information.
exports.actorInfoValidator = [
  check("name").trim().not().isEmpty().withMessage("Name required!"),
  check("dob")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Date of Birth is missing!")
    .custom((dob) => {
      const birthDate = new Date(dob);
      const today = new Date();

      if (birthDate >= today) {
        throw new Error();
      }

      return true;
    })
    .withMessage("Date of Birth must not be later than today!"),
  check("about").trim().not().isEmpty().withMessage("About required!"),
  check("gender").trim().not().isEmpty().withMessage("Gender required!"),
];

// Validate movie information.
exports.validateMovie = [
  check("title").trim().not().isEmpty().withMessage("Title is missing!"),
  check("storyLine")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Storyline is missing!"),
  check("type").trim().not().isEmpty().withMessage("Type is missing!"),
  check("genres")
    .isArray()
    .withMessage("Genres must be an array of strings!")
    .custom((value) => {
      for (let g of value) {
        if (!genres.includes(g)) throw Error("Invalid genres!");
      }

      return true;
    }),
  check("tags")
    .isArray({ min: 1 })
    .withMessage("Tags must be an array of strings!")
    .custom((tags) => {
      for (let tag of tags) {
        if (typeof tag !== "string")
          throw Error("Tags must be an array of strings!");
      }

      return true;
    }),
  check("releaseDate").isDate().withMessage("Release date is missing!"),
  check("status")
    .isIn(["Public", "Private"])
    .withMessage("Status must be Public or Private!"),
  check("cast")
    .isArray()
    .withMessage("Cast must be an array of objects!")
    .custom((cast) => {
      for (let c of cast) {
        if (!isValidObjectId(c.actor))
          throw Error("Invalid cast id inside cast!");
        if (!c.roleAs?.trim()) throw Error("Role as is missing inside cast!");
        if (typeof c.leadActor !== "boolean")
          throw Error(
            "Only accepted boolean value inside leadActor inside cast!"
          );
      }

      return true;
    }),
  check("language").trim().not().isEmpty().withMessage("Language is missing!"),
  check("filmRating")
    .isIn(["G", "PG", "PG-13", "R", "NC-17", "NR"])
    .withMessage("Film Rating must be G, PG, PG-13, R, NC-17, or NR!"),
];

// Validate trailer information.
exports.validateTrailer = check("trailer")
  .isObject()
  .withMessage("Trailer must be an object with URL and public_id!")
  .custom(({ url, public_id }) => {
    try {
      const result = new URL(url);
      if (!result.protocol.includes("http")) {
        throw Error("Trailer URL is invalid!");
      }

      const arr = url.split("/");
      const publicId = arr[arr.length - 1].split(".")[0];

      if (public_id !== publicId) {
        throw Error("Trailer public_id is invalid!");
      }

      return true;
    } catch (error) {
      throw Error("Trailer URL is invalid!");
    }
  });

// Validate ratings information.
exports.validateRatings = check(
  "rating",
  "Rating must be a number between 0 and 10!"
).isFloat({ min: 0, max: 10 });

// Perform validation on the request.
exports.validate = (req, res, next) => {
  const error = validationResult(req).array();

  if (error.length) {
    return res.json({ error: error[0].msg });
  }

  next();
};

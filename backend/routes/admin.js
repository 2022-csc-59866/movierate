// Import middlewares: isAuth, isAdmin.
const { isAuth, isAdmin } = require("../middlewares/auth");

// Import getAppInfo, getMostRated controllers.
const { getAppInfo, getMostRated } = require("../controllers/admin");

// Create a new instance of the Router class from the Express framework.
const router = require("express").Router();

// Method: GET
// Controller: getAppInfo.
// Middlewares: isAuth, isAdmin.
router.get("/app-info", isAuth, isAdmin, getAppInfo);

// Method: GET
// Controller: getMostRated.
// Middlewares: isAuth, isAdmin.
router.get("/most-rated", isAuth, isAdmin, getMostRated);

module.exports = router;

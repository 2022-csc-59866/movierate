// Import express.
const express = require("express");

// Import middleware: isAuth.
const { isAuth, isAdmin } = require("../middlewares/auth");
// Import middleware: isValidPassResetToken.
const { isValidPassResetToken } = require("../middlewares/user");
// Import validators.
const {
  userValidator,
  validate,
  validatePassword,
  signInValidator,
} = require("../middlewares/validator");

// Import controllers.
const {
  create,
  verifyEmail,
  resendEmailVerificationToken,
  forgetPassword,
  sendResetPasswordTokenStatus,
  resetPassword,
  signIn,
  getUsers,
  searchUser,
  updateUser,
  removeUser,
  getSingleUser,
} = require("../controllers/user");

// Create a new instance of the Router class from the Express framework.
const router = express.Router();

// Method: POST
// Controller: create.
// Middlewares: userValidator, validate.
router.post("/create", userValidator, validate, create);

// Method: POST
// Controller: signIn.
// Middlewares: signInValidator, validate.
router.post("/sign-in", signInValidator, validate, signIn);

// Method: POST
// Controller: verifyEmail.
router.post("/verify-email", verifyEmail);

// Method: POST
// Controller: resendEmailVerificationToken.
router.post("/resend-email-verification-token", resendEmailVerificationToken);

// Method: POST
// Controller: forgetPassword.
router.post("/forget-password", forgetPassword);

// Method: POST
// Controller: sendResetPasswordTokenStatus.
// Middlewares: isValidPassResetToken.
router.post(
  "/verify-pass-reset-token",
  isValidPassResetToken,
  sendResetPasswordTokenStatus
);

// Method: POST
// Controller: resetPassword.
// Middlewares: validatePassword, validate, isValidPassResetToken.
router.post(
  "/reset-password",
  validatePassword,
  validate,
  isValidPassResetToken,
  resetPassword
);

// Method: GET
// Middleware: isAuth.
router.get("/is-auth", isAuth, (req, res) => {
  const { user } = req;
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
      googleId: user.googleId,
      githubId: user.githubId,
    },
  });
});

// Method: GET
// Controller: getUsers.
// Middlewares: isAuth, isAdmin.
router.get("/users", isAuth, isAdmin, getUsers);

// Method: GET
// Controller: searchUser.
// Middlewares: isAuth, isAdmin.
router.get("/search", isAuth, isAdmin, searchUser);

// Dynamic Route with userId.
// Method: POST
// Controller: updateUser.
// Middlewares:  isAuth, isAdmin, userInfoValidator, validate.
router.post(
  "/update/:userId",
  isAuth,
  isAdmin,
  // userValidator,
  validate,
  updateUser
);

// Dynamic Route with userId.
// Method: DELETE
// Controller: removeUser.
// Middlewares: isAuth, isAdmin.
router.delete("/:userId", isAuth, isAdmin, removeUser);

// Method: GET
// Controller: getSingleUser.
router.get("/single/:id", getSingleUser);

module.exports = router;

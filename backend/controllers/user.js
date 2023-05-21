// Import jsonwebtoken.
const jwt = require("jsonwebtoken");
// Import User model.
const User = require("../models/user");
// Import EmailVerificationToken model.
const EmailVerificationToken = require("../models/emailVerificationToken");
// Import PasswordResetToken model.
const PasswordResetToken = require("../models/passwordResetToken");
//Import isValidObjectId.
const { isValidObjectId } = require("mongoose");
// Import mail helper utility functions: generateOTP and generateMailTransporter.
const { generateOTP, generateMailTransporter } = require("../utils/mail");
//Import helper functions:  sendError, generateRandomByte.
const {
  sendError,
  generateRandomByte,
  formatUser,
} = require("../utils/helper");
const { sendEmail } = require("../utils/mail");

// Controller: create.
exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return sendError(res, "Email  already registered!");
  }

  const newUser = new User({ name, email, password });

  await newUser.save();

  let OTP = generateOTP(6);

  var timestamp = new Date().getTime();

  var createdTime = new Date(timestamp);

  var expiresTime = new Date(timestamp);

  expiresTime.setUTCMinutes(expiresTime.getUTCMinutes() + 10);

  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
    createdAt: createdTime,
  });

  await newEmailVerificationToken.save();

  // var transport = generateMailTransporter();

  // transport.sendMail({
  //   from: "verification@movierate.com",
  //   to: newUser.email,
  //   subject: "Welcome to MovieRate - Email Verification",
  //   html: `
  //     <div style="text-align:center;">
  //       <img src="https://res.cloudinary.com/dgnigx1ez/image/upload/v1684094877/logo_e41bp2.png" alt="MovieRate log">
  //     </div>
  //     <h1 style="color:#d0a462;text-align:center;">You verification OTP for MovieRate</h1>
  //     <h2 style="color:#282c34;text-align:left;">This email is intended for the user with name: ${newUser.name} and email address: ${newUser.email} registered at MovieRate.</h2>
  //     <div style="padding: 1px; background-color: #f1f1f1; width: 50%; margin-left: auto; margin-right: auto;">
  //       <h1 style="color:#282c34;text-align:center;">OTP</h1>
  //       <h1 style="color:#282c34;text-align:center;">${OTP}</h1>
  //     </div>
  //     <h3 style="color:#282c34;text-align:center;">OTP created at: ${createdTime}</h3>
  //     <h3 style="color:#282c34;text-align:center;">OTP expires at: ${expiresTime}</h3>
  //     <h2 style="color:#ff0000;text-align:left;size=5rem;">You received this email because someone tried to register/login with this email account at MovieRate! If this was you, you can disregard this message! Otherwise, please change your password or ignore this email!</h2>
  //     <h4 style="color:#1c1f25;text-align:center;">Thank you very much for choosing MovieRate!</h4>
  //     <h4 style="color:#1c1f25;text-align:center;">© 2023, MovieRate, Inc. or its affiliates. All rights reserved.</h4>
  //   `,
  // });

  const htmlContent = `
  <div style="text-align:center;">
    <img src="https://res.cloudinary.com/dgnigx1ez/image/upload/v1684094877/logo_e41bp2.png" alt="MovieRate log">
  </div>
  <h1 style="color:#d0a462;text-align:center;">You verification OTP for MovieRate</h1>
  <h2 style="color:#282c34;text-align:left;">This email is intended for the user with name: ${newUser.name} and email address: ${newUser.email} registered at MovieRate.</h2>
  <div style="padding: 1px; background-color: #f1f1f1; width: 50%; margin-left: auto; margin-right: auto;">
    <h1 style="color:#282c34;text-align:center;">OTP</h1>
    <h1 style="color:#282c34;text-align:center;">${OTP}</h1>
  </div>
  <h3 style="color:#282c34;text-align:center;">OTP created at: ${createdTime}</h3>
  <h3 style="color:#282c34;text-align:center;">OTP expires at: ${expiresTime}</h3>
  <h2 style="color:#ff0000;text-align:left;size=5rem;">You received this email because someone tried to register/login with this email account at MovieRate! If this was you, you can disregard this message! Otherwise, please change your password or ignore this email!</h2>
  <h4 style="color:#1c1f25;text-align:center;">Thank you very much for choosing MovieRate!</h4>
  <h4 style="color:#1c1f25;text-align:center;">© 2023, MovieRate, Inc. or its affiliates. All rights reserved.</h4>
`;
  await sendEmail(
    newUser.email,
    newUser.name,
    "Email Verification",
    htmlContent
  );

  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

// Controller: verifyEmail.
exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  if (!isValidObjectId(userId)) {
    return sendError(res, "Invalid User!");
  }

  const user = await User.findById(userId);

  if (!user) {
    return sendError(res, "User not found!", 404);
  }

  if (user.isVerified) {
    return sendError(res, "User already verified!");
  }

  const token = await EmailVerificationToken.findOne({ owner: userId });

  if (!token) {
    return sendError(res, "Token not found!");
  }

  const isMatched = await token.compareToken(OTP);

  if (!isMatched) {
    return sendError(res, "Please submit a valid OTP!");
  }

  user.isVerified = true;

  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);

  // var transport = generateMailTransporter();

  const htmlContent = `
  <div style="text-align:center;">
    <img src="https://res.cloudinary.com/dgnigx1ez/image/upload/v1684094877/logo_e41bp2.png" alt="MovieRate log">
  </div>
  <h1 style="color:#d0a462;text-align:center;">Welcome to MovieRate!</h1>
  <h2 style="color:#282c34;text-align:left;">This email is intended for the user with name: ${user.name} and email address: ${user.email} registered at MovieRate.</h2>
  <h2 style="color:#ff0000;text-align:left;size=5rem;">You received this email because someone tried to register/login with this email account at MovieRate! If this was you, you can disregard this message! Otherwise, please change your password or ignore this email!</h2>
  <h4 style="color:#1c1f25;text-align:center;">Thank you very much for choosing MovieRate!</h4>
  <h4 style="color:#1c1f25;text-align:center;">© 2023, MovieRate, Inc. or its affiliates. All rights reserved.</h4>
`;
  await sendEmail(user.email, user.name, "Welcome - Movie Rate", htmlContent);

  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: jwtToken,
      isVerified: user.isVerified,
      role: user.role,
      googleId: user.googleId,
      githubId: user.githubId,
    },
    message: "Email verified!",
  });
};

// Controller: resendEmailVerificationToken.
exports.resendEmailVerificationToken = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return sendError(res, "User not found!");
  }

  if (user.isVerified) {
    return sendError(res, "Email already verified!");
  }

  const alreadyHasToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (alreadyHasToken)
    return sendError(
      res,
      "After ten minutes you can request for another OTP token!"
    );

  let OTP = generateOTP(6);

  var timestamp = new Date().getTime();

  var createdTime = new Date(timestamp);

  var expiresTime = new Date(timestamp);

  expiresTime.setUTCMinutes(expiresTime.getUTCMinutes() + 10);

  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();

  // var transport = generateMailTransporter();

  // transport.sendMail({
  //   from: "verification@movierate.com",
  //   to: user.email,
  //   subject: "Welcome to MovieRate - Email Verification",
  //   html: `
  //     <div style="text-align:center;">
  //       <img src="https://res.cloudinary.com/dgnigx1ez/image/upload/v1684094877/logo_e41bp2.png" alt="MovieRate log">
  //     </div>
  //     <h1 style="color:#d0a462;text-align:center;">You verification OTP for MovieRate</h1>
  //     <h2 style="color:#282c34;text-align:left;">This email is intended for the user with name: ${user.name} and email address: ${user.email} registered at MovieRate.</h2>
  //     <div style="padding: 1px; background-color: #f1f1f1; width: 50%; margin-left: auto; margin-right: auto;">
  //       <h1 style="color:#282c34;text-align:center;">OTP</h1>
  //       <h1 style="color:#282c34;text-align:center;">${OTP}</h1>
  //     </div>
  //     <h3 style="color:#282c34;text-align:center;">OTP created at: ${createdTime}</h3>
  //     <h3 style="color:#282c34;text-align:center;">OTP expires at: ${expiresTime}</h3>
  //     <h2 style="color:#ff0000;text-align:left;size=5rem;">You received this email because someone tried to register/login with this email account at MovieRate! If this was you, you can disregard this message! Otherwise, please change your password or ignore this email!</h2>
  //     <h4 style="color:#1c1f25;text-align:center;">Thank you very much for choosing MovieRate!</h4>
  //     <h4 style="color:#1c1f25;text-align:center;">© 2023, MovieRate, Inc. or its affiliates. All rights reserved.</h4>
  //   `,
  // });

  const htmlContent = `
      <div style="text-align:center;">
        <img src="https://res.cloudinary.com/dgnigx1ez/image/upload/v1684094877/logo_e41bp2.png" alt="MovieRate log">
      </div>
      <h1 style="color:#d0a462;text-align:center;">You verification OTP for MovieRate</h1>
      <h2 style="color:#282c34;text-align:left;">This email is intended for the user with name: ${user.name} and email address: ${user.email} registered at MovieRate.</h2>
      <div style="padding: 1px; background-color: #f1f1f1; width: 50%; margin-left: auto; margin-right: auto;">
        <h1 style="color:#282c34;text-align:center;">OTP</h1>
        <h1 style="color:#282c34;text-align:center;">${OTP}</h1>
      </div>
      <h3 style="color:#282c34;text-align:center;">OTP created at: ${createdTime}</h3>
      <h3 style="color:#282c34;text-align:center;">OTP expires at: ${expiresTime}</h3>
      <h2 style="color:#ff0000;text-align:left;size=5rem;">You received this email because someone tried to register/login with this email account at MovieRate! If this was you, you can disregard this message! Otherwise, please change your password or ignore this email!</h2>
      <h4 style="color:#1c1f25;text-align:center;">Thank you very much for choosing MovieRate!</h4>
      <h4 style="color:#1c1f25;text-align:center;">© 2023, MovieRate, Inc. or its affiliates. All rights reserved.</h4>
    `;
  await sendEmail(
    user.email,
    user.name,
    "Email Verification - Movie Rate",
    htmlContent
  );

  res.json({
    message: "New OTP TOKEN has been sent to your registered email account",
  });
};

// Controller: forgetPassword.
exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return sendError(res, "Email is missing!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    return sendError(res, "User not found!", 404);
  }

  const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });

  if (alreadyHasToken)
    return sendError(
      res,
      "After ten minutes since your last request you can request for a new OTP Token!"
    );

  const token = await generateRandomByte();

  const newPasswordResetToken = await PasswordResetToken({
    owner: user._id,
    token,
  });

  await newPasswordResetToken.save();

  const resetPasswordUrl = `https://app.movierate.tv/auth/reset-password?token=${token}&id=${user._id}`;

  // const transport = generateMailTransporter();

  // transport.sendMail({
  //   from: "security@movierate.com",
  //   to: user.email,
  //   subject: "MovieRate Security- Reset Password Link",
  //   html: `
  //     <div style="text-align:center;">
  //       <img src="https://res.cloudinary.com/dgnigx1ez/image/upload/v1684094877/logo_e41bp2.png" alt="MovieRate log">
  //     </div>
  //     <h1 style="color:#d0a462;text-align:center;">You Reset Password Link for MovieRate</h1>
  //     <h2 style="color:#282c34;text-align:left;">This email is intended for the user with name: ${user.name} and email address: ${user.email} registered at MovieRate.</h2>
  //     <div style="padding: 1px; background-color: #f1f1f1; width: 50%; margin-left: auto; margin-right: auto; text-align: center;">
  //       <a href="${resetPasswordUrl}" style="color:#282c34;">Change Password</a>
  //     </div>
  //     <h3 style="color:#282c34;text-align:center;">Reset link created at: ${createdTime}</h3>
  //     <h3 style="color:#282c34;text-align:center;">Reset link expires at: ${expiresTime}</h3>
  //     <h2 style="color:#ff0000;text-align:left;size=5rem;">You received this email because someone requested to reset the password associated with this email account at MovieRate! If this was you, you can disregard this message! Otherwise, please change your password or ignore this email!</h2>
  //     <h4 style="color:#1c1f25;text-align:center;">Thank you very much for choosing MovieRate!</h4>
  //     <h4 style="color:#1c1f25;text-align:center;">© 2023, MovieRate, Inc. or its affiliates. All rights reserved.</h4>
  //   `,
  // });

  const htmlContent = `
  <div style="text-align:center;">
    <img src="https://res.cloudinary.com/dgnigx1ez/image/upload/v1684094877/logo_e41bp2.png" alt="MovieRate log">
  </div>
  <h1 style="color:#d0a462;text-align:center;">You Reset Password Link for MovieRate</h1>
  <h2 style="color:#282c34;text-align:left;">This email is intended for the user with name: ${user.name} and email address: ${user.email} registered at MovieRate.</h2>
  <div style="padding: 1px; background-color: #f1f1f1; width: 50%; margin-left: auto; margin-right: auto; text-align: center;">
    <a href="${resetPasswordUrl}" style="color:#282c34;">Change Password</a>
  </div>
  <h3 style="color:#282c34;text-align:center;">Reset link created at: ${createdTime}</h3>
  <h3 style="color:#282c34;text-align:center;">Reset link expires at: ${expiresTime}</h3>
  <h2 style="color:#ff0000;text-align:left;size=5rem;">You received this email because someone requested to reset the password associated with this email account at MovieRate! If this was you, you can disregard this message! Otherwise, please change your password or ignore this email!</h2>
  <h4 style="color:#1c1f25;text-align:center;">Thank you very much for choosing MovieRate!</h4>
  <h4 style="color:#1c1f25;text-align:center;">© 2023, MovieRate, Inc. or its affiliates. All rights reserved.</h4>
`;
  await sendEmail(
    user.email,
    user.name,
    "Reset Password Link - Movie Rate",
    htmlContent
  );

  res.json({ message: "Reset Password Link has been sent to your email!" });
};

// Controller: sendResetPasswordTokenStatus
exports.sendResetPasswordTokenStatus = (req, res) => {
  res.json({ valid: true });
};

// Controller: resetPassword.
exports.resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body;

  const user = await User.findById(userId);

  const matched = await user.comparePassword(newPassword);
  if (matched)
    return sendError(
      res,
      "The new password must be different from the old one!"
    );

  user.password = newPassword;

  await user.save();

  await PasswordResetToken.findByIdAndDelete(req.resetToken._id);

  // const transport = generateMailTransporter();

  // transport.sendMail({
  //   from: "security@reviewapp.com",
  //   to: user.email,
  //   subject: "MovieRate Security - Password Reset Successfully",
  //   html: `
  //     <div style="text-align:center;">
  //       <img src="https://res.cloudinary.com/dgnigx1ez/image/upload/v1684094877/logo_e41bp2.png" alt="MovieRate log">
  //     </div>
  //     <h1 style="color:#d0a462;text-align:center;">Password Reset Successfully for MovieRate</h1>
  //     <h2 style="color:#282c34;text-align:center;">Now you can use your new password!</h2>
  //     <h2 style="color:#282c34;text-align:left;">This email is intended for the user with name: ${user.name} and email address: ${user.email} registered at MovieRate.</h2>
  //     <h2 style="color:#ff0000;text-align:left;size=5rem;">You received this email because the password associated with this email account at MovieRate has been reset successfully! If this was you, you can disregard this message. Otherwise, please contact us!</h2>
  //     <h4 style="color:#1c1f25;text-align:center;">Thank you very much for choosing MovieRate!</h4>
  //     <h4 style="color:#1c1f25;text-align:center;">© 2023, MovieRate, Inc. or its affiliates. All rights reserved.</h4>
  //   `,
  // });

  const htmlContent = `
  <div style="text-align:center;">
    <img src="https://res.cloudinary.com/dgnigx1ez/image/upload/v1684094877/logo_e41bp2.png" alt="MovieRate log">
  </div>
  <h1 style="color:#d0a462;text-align:center;">Password Reset Successfully for MovieRate</h1>
  <h2 style="color:#282c34;text-align:center;">Now you can use your new password!</h2>
  <h2 style="color:#282c34;text-align:left;">This email is intended for the user with name: ${user.name} and email address: ${user.email} registered at MovieRate.</h2>
  <h2 style="color:#ff0000;text-align:left;size=5rem;">You received this email because the password associated with this email account at MovieRate has been reset successfully! If this was you, you can disregard this message. Otherwise, please contact us!</h2>
  <h4 style="color:#1c1f25;text-align:center;">Thank you very much for choosing MovieRate!</h4>
  <h4 style="color:#1c1f25;text-align:center;">© 2023, MovieRate, Inc. or its affiliates. All rights reserved.</h4>
`;

  await sendEmail(
    user.email,
    user.name,
    "Password Reset Successfully - Movie Rate",
    htmlContent
  );

  res.json({
    message:
      "Password has been reset successfully! Now you can use your new password!",
  });
};

// Controller: signIn.
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return sendError(res, "Email/Password mismatch!");
  }

  const matched = await user.comparePassword(password);

  if (!matched) {
    return sendError(res, "Email/Password mismatch!");
  }

  const { _id, name, role, googleId, githubId, isVerified } = user;

  const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({
    user: {
      id: _id,
      name,
      email,
      role,
      googleId,
      githubId,
      token: jwtToken,
      isVerified,
    },
  });
};

// Controller: getUsers.
exports.getUsers = async (req, res) => {
  const { pageNo, limit } = req.query;

  const users = await User.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  const profiles = users.map((user) => formatUser(user));
  res.json({
    profiles,
  });
};

// Controller: searchUser.
exports.searchUser = async (req, res) => {
  const { name } = req.query;

  if (!name.trim()) {
    return sendError(res, "Invalid request!");
  }

  const result = await User.find({
    name: { $regex: name, $options: "i" },
  });

  const users = result.map((user) => formatUser(user));

  res.json({ results: users });
};

// Controller: updateUser.
exports.updateUser = async (req, res) => {
  const { name, email, role, googleId, githubId } = req.body;
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    return sendError(res, "Invalid request, user not found!");
  }

  const user = await User.findById(userId);

  if (!user) {
    return sendError(res, "Invalid request, user not found!");
  }

  user.name = name;
  user.email = email;
  user.role = role;
  user.googleId = googleId;
  user.githubId = githubId;

  await user.save();

  res.status(201).json({ user: formatUser(user) });
};

// Controller: removeUser.
exports.removeUser = async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    return sendError(res, "Invalid request, user not found!");
  }

  const user = await User.findById(userId);

  if (!user) {
    return sendError(res, "Invalid request, user not found!");
  }

  await User.findByIdAndDelete(userId);

  res.json({ message: "User removed successfully!" });
};

// Controller: getSingleUser.
exports.getSingleUser = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return sendError(res, "Invalid request, user not found!");
  }

  const user = await User.findById(id);

  if (!user) {
    return sendError(res, "Invalid request, user not found!", 404);
  }

  res.json({ user: formatUser(user) });
};

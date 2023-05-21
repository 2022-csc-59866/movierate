// Import dotenv.
require("dotenv").config();
// Automatically add try/catch blocks to async route handlers and middleware functions.
require("express-async-errors");
// Import express.
const express = require("express");
// Import path.
const path = require("path");
// Logging incoming HTTP requests
const morgan = require("morgan");
// Allow the web application from one domain to access resources, such as APIs, on a different domain.
const cors = require("cors");
// Connect to the movierate_db.
require("./db");
// Import express-session.
const cookieSession = require("express-session");
// Import passport.js
const passport = require("passport");
// Import User model.
const User = require("./models/user");
// Import cookie-parser.
const cookieParser = require("cookie-parser");
// Import jsonwebtoken.
const jwt = require("jsonwebtoken");
// Import middleware: errorHandler.
const { errorHandler } = require("./middlewares/error");
// Import helper function handleNotFound.
const { handleNotFound } = require("./utils/helper");

// Environment variables for third-party authentication.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Third-party authentication.
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;

// Import user router.
const userRouter = require("./routes/user");
// Import actor router.
const actorRouter = require("./routes/actor");
// Import movie router.
const movieRouter = require("./routes/movie");
// Import review router.
const reviewRouter = require("./routes/review");
// Import admin router.
const adminRouter = require("./routes/admin");

// Create a new instance of the Express application.
const app = express();

// Use cors.
app.use(cors());
// Convert everything coming from the front-end to JSON format.
app.use(express.json());
//
app.use(express.static(path.join(__dirname, "public")));
// Use the morgan middleware in the express application.
app.use(morgan("dev"));
// Use cookieParser.
app.use(cookieParser());

// API user Router.
// All user APIs are forwarded to /api/user
app.use("/api/user", userRouter);
// API actor Router.
// All actor APIs are forwarded to /api/actor
app.use("/api/actor", actorRouter);
// API movie Router.
// All movie APIs are forwarded to /api/movie
app.use("/api/movie", movieRouter);
// API review Router.
// All review APIs are forwarded to /api/review
app.use("/api/review", reviewRouter);
// API admin Router.
// All admin APIs are forwarded to /api/admin
app.use("/api/admin", adminRouter);

// Third-party authentication.
app.set("trust proxy", 1);

// Third-party authentication.
app.use(
  cookieSession({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 3600000, // Expires in one hour.
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  return done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, doc) => {
    return done(null, doc);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "https://movierate.tv/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      User.findOne({ googleId: profile.id }, async (err, doc) => {
        if (err) {
          return cb(err, null);
        }

        if (!doc) {
          const newUser = new User({
            name: profile._json.given_name,
            email: profile._json.email,
            isVerified: profile._json.email_verified,
            googleId: profile._json.sub,
          });

          await newUser.save();

          doc = newUser;
        }
        cb(null, doc);
      });
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "https://movierate.tv/auth/github/callback",
      scope: ["user:email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      User.findOne({ githubId: profile.id }, async (err, doc) => {
        if (err) {
          return cb(err, null);
        }

        if (!doc) {
          const newUser = new User({
            name: profile._json.name,
            email: profile.emails[0].value,
            isVerified: true,
            githubId: profile._json.id,
          });

          await newUser.save();

          doc = newUser;
        }
        cb(null, doc);
      });
    }
  )
);

function generateUserToken(req, res) {
  const jwtToken = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("auth-token", jwtToken, {
    httpOnly: false,
    secure: true, // Set to 'true' for using HTTPS.
    sameSite: "none",
    maxAge: 3600000, // Expires in one hour.
  });
  res.redirect("https://app.movierate.tv/");
}

app.get(
  "/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["openid", "profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate(
    "google",

    {
      failureRedirect: "https://app.movierate.tv/auth/signin",
      session: false,
    }
  ),
  (req, res) => {
    generateUserToken(req, res);
  }
);

app.get(
  "/auth/github",
  passport.authenticate("github", {
    session: false,
    scope: ["openid", "profile", "user:email"],
  })
);

app.get(
  "/auth/github/callback",
  passport.authenticate(
    "github",

    {
      failureRedirect: "https://app.movierate.tv/auth/signin",
      session: false,
    }
  ),
  (req, res) => {
    generateUserToken(req, res);
  }
);

// Handle not found error.
app.use("/*", handleNotFound);

// Error handling method.
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("Express server running on port " + PORT + "!");
});

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("movierate_db connected!");
  })
  .catch((ex) => {
    console.log("movierate_db connection failed: ", ex, "!");
  });

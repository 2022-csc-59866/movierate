// Import multer to filer uploaded files.
const multer = require("multer");

// Configure the storage where the files will be stored.
const storage = multer.diskStorage({});

// Filter the file before uploading to validate that it is an image.
const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    cb("Supported only image files!", false);
  }
  cb(null, true);
};

// Filter the file before uploading to validate that it is a video.
const videoFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("video")) {
    cb("Supported only image files!", false);
  }
  cb(null, true);
};

exports.uploadImage = multer({ storage, fileFilter: imageFileFilter });
exports.uploadVideo = multer({ storage, fileFilter: videoFileFilter });

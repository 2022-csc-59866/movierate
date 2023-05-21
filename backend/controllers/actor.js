// Import Actor model.
const Actor = require("../models/actor");

// Import isValidObjectId.
const { isValidObjectId } = require("mongoose");

// Import helper functions: sendError, uploadImageToCloud, formatActor.
const {
  sendError,
  uploadImageToCloud,
  formatActor,
} = require("../utils/helper");

// Import cloudinary configurations.
const cloudinary = require("../cloud");

// Controller: createActor.
exports.createActor = async (req, res) => {
  const { name, dob, about, gender, age, died } = req.body;
  const { file } = req;

  const newActor = new Actor({ name, dob, about, gender, age, died });

  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    newActor.profile = { url, public_id };
  }
  await newActor.save();

  // Return/Send message.
  res.status(201).json({ actor: formatActor(newActor) });
};

// Controller: updateActor.
exports.updateActor = async (req, res) => {
  const { name, dob, about, gender, age, died } = req.body;
  const { file } = req;
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) {
    return sendError(res, "Invalid request, actor not found!");
  }

  const actor = await Actor.findById(actorId);

  if (!actor) {
    return sendError(res, "Invalid request, actor not found!");
  }

  const public_id = actor.profile?.public_id;

  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);

    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud!");
    }
  }

  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    actor.profile = { url, public_id };
  }

  actor.name = name;
  actor.dob = dob;
  actor.about = about;
  actor.gender = gender;
  actor.age = age;
  actor.died = died;

  await actor.save();

  res.status(201).json({ actor: formatActor(actor) });
};

// Controller: removeActor.
exports.removeActor = async (req, res) => {
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) {
    return sendError(res, "Invalid request, actor not found!");
  }

  const actor = await Actor.findById(actorId);

  if (!actor) {
    return sendError(res, "Invalid request, actor not found!");
  }

  const public_id = actor.profile?.public_id;

  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);

    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud!");
    }
  }

  await Actor.findByIdAndDelete(actorId);

  res.json({ message: "Actor removed successfully!" });
};

// Controller: searchActor.
exports.searchActor = async (req, res) => {
  const { name } = req.query;

  if (!name.trim()) {
    return sendError(res, "Invalid request!");
  }

  const result = await Actor.find({
    name: { $regex: name, $options: "i" },
  });

  const actors = result.map((actor) => formatActor(actor));

  res.json({ results: actors });
};

// Controller: getLatestActors.
exports.getLatestActors = async (req, res) => {
  const result = await Actor.find().sort({ createdAt: "-1" }).limit(12);

  const actors = result.map((actor) => formatActor(actor));

  res.json(actors);
};

// Controller: getSingleActor.
exports.getSingleActor = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return sendError(res, "Invalid request, actor not found!");
  }

  const actor = await Actor.findById(id);

  if (!actor) {
    return sendError(res, "Invalid request, actor not found!", 404);
  }

  res.json({ actor: formatActor(actor) });
};

// Controller: getActors.
exports.getActors = async (req, res) => {
  const { pageNo, limit } = req.query;

  const actors = await Actor.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  const profiles = actors.map((actor) => formatActor(actor));
  res.json({
    profiles,
  });
};

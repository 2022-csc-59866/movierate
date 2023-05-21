// Import Movie model.
const Movie = require("../models/movie");
// Import Review model.
const Review = require("../models/review");
// Import isValidObjectId.
const { isValidObjectId } = require("mongoose");
// Import helper functions:
// sendError.
// formatActor.
// averageRatingPipeline.
// relatedMovieAggregation.
// getAverageRatings.
// topRatedMoviesPipeline.
const {
  sendError,
  formatActor,
  averageRatingPipeline,
  relatedMovieAggregation,
  getAverageRatings,
  topRatedMoviesPipeline,
} = require("../utils/helper");

// Import cloudinary configurations.
const cloudinary = require("../cloud");

// Controller: uploadTrailer.
exports.uploadTrailer = async (req, res) => {
  const { file } = req;
  if (!file) {
    return sendError(res, "Trailer is missing!");
  }

  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      resource_type: "video",
    }
  );
  res.status(201).json({ url, public_id });
};

// Controller: createMovie.
exports.createMovie = async (req, res) => {
  const { file, body } = req;

  const {
    trailer, // Object with url and public_id.
    title, // String.
    storyLine, // String.
    type, // String.
    genres, // Array of genre Strings.
    tags, // Array of tag Strings
    releaseDate, // String
    status, // String.
    directors, // Array of ObjectIds.
    writers, // Array of ObjectIds.
    cast, // Array of Objects with if, roleAs, and leadActor.
    language, // String.
    filmRating, // String.
  } = body;

  const newMovie = new Movie({
    trailer, // Object with url and public_id.
    title, // String.
    storyLine, // String.
    type, // String.
    genres, // Array of genre Strings.
    tags, // Array of tag Strings
    releaseDate, // String
    status, // String.
    cast, // Array of Objects with if, roleAs, and leadActor.
    language, // String.
    filmRating, // String.
  });

  if (directors) {
    for (let directorId of directors) {
      if (!isValidObjectId(directorId))
        return sendError(res, "Invalid request, director not found!");
    }

    newMovie.directors = directors;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid request, writer not found!");
    }

    newMovie.writers = writers;
  }

  if (file) {
    const {
      secure_url: url,
      public_id,
      responsive_breakpoints,
    } = await cloudinary.uploader.upload(file.path, {
      transformation: {
        width: 1280,
        height: 720,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    });

    const finalPoster = { url, public_id, responsive: [] };

    const { breakpoints } = responsive_breakpoints[0];

    if (breakpoints.length) {
      for (let imgObj of breakpoints) {
        const { secure_url } = imgObj;
        finalPoster.responsive.push(secure_url);
      }
    }
    newMovie.poster = finalPoster;
  }

  await newMovie.save();

  res.status(201).json({
    movie: {
      id: newMovie._id,
      title,
    },
  });
};

// Controller: updateMovieWithoutPoster.
exports.updateMovieWithoutPoster = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) {
    return sendError(res, "Invalid Movie ID!");
  }

  const movie = await Movie.findById(movieId);

  if (!movie) {
    return sendError(res, "Movie Not Found!", 404);
  }

  const {
    trailer, // Object with url and public_id.
    title, // String.
    storyLine, // String.
    type, // String.
    genres, // Array of genre Strings.
    tags, // Array of tag Strings
    releaseDate, // String
    status, // String.
    directors, // Array of ObjectIds.
    writers, // Array of ObjectIds.
    cast, // Array of Objects with if, roleAs, and leadActor.
    language, // String.
    filmRating, // String.
  } = req.body;

  movie.trailer = trailer;
  movie.title = title;
  movie.storyLine = storyLine;
  movie.type = type;
  movie.genres = genres;
  movie.tags = tags;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.cast = cast;
  movie.language = language;
  movie.filmRating = filmRating;

  if (directors) {
    for (let directorId of directors) {
      if (!isValidObjectId(directorId))
        return sendError(res, "Invalid director ID!");
    }

    movie.directors = directors;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer ID!");
    }

    movie.writers = writers;
  }

  await movie.save();

  res.json({ message: "Movie updated!", movie });
};

// Controller: updateMovie.
exports.updateMovie = async (req, res) => {
  const { movieId } = req.params;
  const { file } = req;

  if (!isValidObjectId(movieId)) {
    return sendError(res, "Invalid Movie ID!");
  }

  const movie = await Movie.findById(movieId);

  if (!movie) {
    return sendError(res, "Movie Not Found!", 404);
  }

  const {
    trailer,
    title,
    storyLine,
    type,
    genres,
    tags,
    releaseDate,
    status,
    directors,
    writers,
    cast,
    language,
    filmRating,
  } = req.body;

  movie.trailer = trailer;
  movie.title = title;
  movie.storyLine = storyLine;
  movie.type = type;
  movie.genres = genres;
  movie.tags = tags;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.cast = cast;
  movie.language = language;
  movie.filmRating = filmRating;

  if (directors) {
    for (let directorId of directors) {
      if (!isValidObjectId(directorId))
        return sendError(res, "Invalid director ID!");
    }

    movie.directors = directors;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer ID!");
    }

    movie.writers = writers;
  }

  if (file) {
    const posterID = movie.poster?.public_id;
    if (posterID) {
      const { result } = await cloudinary.uploader.destroy(posterID);

      if (result !== "ok") {
        return sendError(res, "Could not update poster at the moment!");
      }

      const {
        secure_url: url,
        public_id,
        responsive_breakpoints,
      } = await cloudinary.uploader.upload(req.file.path, {
        transformation: {
          width: 1280,
          height: 720,
        },
        responsive_breakpoints: {
          create_derived: true,
          max_width: 640,
          max_images: 3,
        },
      });

      const finalPoster = { url, public_id, responsive: [] };

      const { breakpoints } = responsive_breakpoints[0];
      if (breakpoints.length) {
        for (let imgObj of breakpoints) {
          const { secure_url } = imgObj;
          finalPoster.responsive.push(secure_url);
        }
      }

      movie.poster = finalPoster;
    }
  }

  await movie.save();

  res.json({
    message: "Movie updated!",
    movie: {
      id: movie._id,
      title: movie.title,
      poster: movie.poster?.url,
      genres: movie.genres,
      status: movie.status,
    },
  });
};

// Controller: removeMovie.
exports.removeMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) {
    return sendError(res, "Invalid Movie ID!");
  }

  const movie = await Movie.findById(movieId);

  if (!movie) {
    return sendError(res, "Movie Not Found!", 404);
  }

  const posterId = movie.poster?.public_id;

  if (posterId) {
    const { result } = await cloudinary.uploader.destroy(posterId);

    if (result !== "ok")
      return sendError(res, "Could not remove poster from cloud!");
  }

  const trailerId = movie.trailer?.public_id;

  if (!trailerId) {
    return sendError(res, "Could not find trailer in the cloud!");
  }

  const { result } = await cloudinary.uploader.destroy(trailerId, {
    resource_type: "video",
  });

  if (result !== "ok")
    return sendError(res, "Could not remove trailer from cloud!");

  await Movie.findByIdAndDelete(movieId);

  res.json({ message: "Movie removed!" });
};

// Controller: getMovies.
exports.getMovies = async (req, res) => {
  const { pageNo = 0, limit = 10 } = req.query;

  const movies = await Movie.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  const results = movies.map((movie) => ({
    id: movie._id,
    title: movie.title,
    poster: movie.poster?.url,
    responsivePosters: movie.poster?.responsive,
    genres: movie.genres,
    status: movie.status,
  }));

  res.json({ movies: results });
};

// Controller: getMovieForUpdate.
exports.getMovieForUpdate = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) {
    return sendError(res, "Movie ID is invalid!");
  }

  const movie = await Movie.findById(movieId).populate(
    "directors writers cast.actor"
  );

  res.json({
    movie: {
      id: movie._id,
      title: movie.title,
      storyLine: movie.storyLine,
      type: movie.type,
      genres: movie.genres,
      tags: movie.tags,
      releaseDate: movie.releaseDate,
      status: movie.status,
      directors: movie.directors.map((d) => formatActor(d)),
      writers: movie.writers.map((w) => formatActor(w)),
      language: movie.language,
      filmRating: movie.filmRating,
      poster: movie.poster?.url,
      cast: movie.cast.map((c) => {
        return {
          id: c.id,
          profile: formatActor(c.actor),
          roleAs: c.roleAs,
          leadActor: c.leadActor,
        };
      }),
    },
  });
};

// Controller: searchMovies.
exports.searchMovies = async (req, res) => {
  const { title } = req.query;

  if (!title.trim()) {
    return sendError(res, "Invalid request!");
  }
  const movies = await Movie.find({ title: { $regex: title, $options: "i" } });

  res.json({
    results: movies.map((m) => {
      return {
        id: m._id,
        title: m.title,
        poster: m.poster?.url,
        genres: m.genres,
        status: m.status,
      };
    }),
  });
};

// Controller: getLatestUploads.
exports.getLatestUploads = async (req, res) => {
  const { limit = 5 } = req.query;

  const results = await Movie.find({ status: "Public" })
    .sort("-createdAt")
    .limit(parseInt(limit));

  const movies = results.map((m) => {
    return {
      id: m._id,
      title: m.title,
      storyLine: m.storyLine,
      poster: m.poster?.url,
      responsivePosters: m.poster.responsive,
      trailer: m.trailer?.url,
    };
  });
  res.json({ movies });
};

// Controller: getSingleMovie.
exports.getSingleMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) {
    return sendError(res, "Movie ID is invalid!");
  }

  const movie = await Movie.findById(movieId).populate(
    "directors writers cast.actor"
  );

  const [aggregatedResponse] = await Review.aggregate(
    averageRatingPipeline(movie._id)
  );

  const reviews = {};

  if (aggregatedResponse) {
    const { ratingAvg, reviewCount } = aggregatedResponse;

    reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
    reviews.reviewCount = reviewCount;
  }

  const {
    _id: id,
    trailer,
    title,
    storyLine,
    type,
    genres,
    tags,
    releaseDate,
    directors,
    writers,
    cast,
    language,
    filmRating,
    poster,
  } = movie;

  res.json({
    movie: {
      id,
      trailer: trailer?.url,
      title,
      storyLine,
      type,
      genres,
      tags,
      releaseDate,
      language,
      filmRating,
      poster: poster?.url,
      directors: directors.map((d) => ({
        id: d._id,
        name: d.name,
      })),
      writers: writers.map((w) => ({
        id: w._id,
        name: w.name,
      })),
      cast: cast.map((c) => ({
        id: c._id,
        profile: {
          id: c.actor._id,
          name: c.actor.name,
          profile: c.actor?.profile?.url,
        },
        leadActor: c.leadActor,
        roleAs: c.roleAs,
      })),
      reviews: { ...reviews },
    },
  });
};

// Controller: getRelatedMovies
exports.getRelatedMovies = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) {
    return sendError(res, "Movie ID invlaid!");
  }

  const movie = await Movie.findById(movieId);

  const movies = await Movie.aggregate(
    relatedMovieAggregation(movie.tags, movie._id)
  );

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      responsivePosters: m.responsivePosters,
      reviews: { ...reviews },
    };
  };
  const relatedMovies = await Promise.all(movies.map(mapMovies));

  res.json({ movies: relatedMovies });
};

// Controller: getTopRatedMovies.
exports.getTopRatedMovies = async (req, res) => {
  const { type = "Film" } = req.query;

  const movies = await Movie.aggregate(topRatedMoviesPipeline(type));

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      responsivePosters: m.responsivePosters,
      reviews: { ...reviews },
    };
  };

  const topRatedMovies = await Promise.all(movies.map(mapMovies));

  res.json({ movies: topRatedMovies });
};

// Controller: serachPublicMovies.
exports.serachPublicMovies = async (req, res) => {
  const { title } = req.query;

  if (!title.trim()) {
    return sendError(res, "Invalid request!");
  }

  const movies = await Movie.find({
    title: { $regex: title, $options: "i" },
    status: "Public",
  });

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      poster: m.poster?.url,
      responsivePosters: m.poster?.responsive,
      reviews: { ...reviews },
    };
  };

  const results = await Promise.all(movies.map(mapMovies));

  res.json({
    results,
  });
};

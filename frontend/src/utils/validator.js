export const validateMovie = (movieInfo) => {
  const {
    title,
    storyLine,
    type,
    genres,
    tags,
    releaseDate,
    status,
    cast,
    language,
    filmRating,
  } = movieInfo;

  if (!title.trim()) {
    return { error: "Title missing!" };
  }

  if (!storyLine.trim()) {
    return { error: "Story line missing!" };
  }

  if (!type.trim()) {
    return { error: "Type missing!" };
  }

  if (!genres.length) {
    return { error: "Genres missing!" };
  }

  for (let gen of genres) {
    if (!gen.trim()) {
      return { error: "Invalid genres!" };
    }
  }

  if (!tags.length) {
    return { error: "Tags missing!" };
  }
  for (let tag of tags) {
    if (!tag.trim()) {
      return { error: "Invalid tags!" };
    }
  }

  if (!releaseDate.trim()) {
    return { error: "Release date missing!" };
  }
  if (!status.trim()) {
    return { error: "Status missing!" };
  }

  if (!cast.length) {
    return { error: "Cast and crew missing!" };
  }
  for (let c of cast) {
    if (typeof c !== "object") {
      return { error: "Invalid cast!" };
    }
  }

  if (!language.trim()) {
    return { error: "Language missing!" };
  }

  if (!filmRating.trim()) {
    return { error: "Film rating missing!" };
  }

  return { error: null };
};

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleMovie } from "../../api/movie";
import { useAuth, useNotification } from "../../hooks";
import { convertReviewCount } from "../../utils/helper";
import Container from "../Container";
import CustomButtonLink from "../CustomButtonLink";
import CustomButtonLinkBullet from "../CustomButtonLinkBullet";
import AddRatingModal from "../modals/AddRatingModal";
import ProfileModal from "../modals/ProfileModal";
import RatingStar from "../RatingStar";
import RelatedMovies from "../RelatedMovies";
const axios = require("axios");

const convertDate = (date = "") => {
  return date.split("T")[0];
};

export default function SingleMovie() {
  const [ready, setReady] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [api, setApi] = useState(false);

  const [movie, setMovie] = useState({});
  const [selectedProfile, setSelectedProfile] = useState({});
  const [obj, setObj] = useState({});

  const { movieId } = useParams();

  const { updateNotification } = useNotification();

  const { authInfo } = useAuth();

  const { isLoggedIn } = authInfo;

  const navigate = useNavigate();

  const {
    id,
    poster,
    trailer,
    title,
    storyLine,
    type,
    genres = [],
    releaseDate,
    directors = [],
    writers = [],
    cast = [],
    reviews = {},
    language,
    filmRating,
  } = movie;

  // Transforming title, type, and language into the required format for the Watchmode API and Streaming Availability API.
  const streamingTitle = title;
  let streamingType = type;
  let streamingLanguage = language;

  if (streamingType) {
    if (streamingType === "Movie") {
      streamingType = "movie";
    } else if (streamingType === "TV Show") {
      streamingType = "tv";
    } else if (streamingType === "TV Series") {
      streamingType = "tv";
    } else if (streamingType === "Documentary") {
      streamingType = "movie";
    }
  }

  if (streamingLanguage) {
    streamingLanguage = streamingLanguage.substring(0, 2).toLowerCase();
  }

  const searchOptions = {
    method: "GET",
    url: "https://watchmode.p.rapidapi.com/search/",
    params: {
      search_field: "name",
      search_value: streamingTitle,
      types: streamingType,
    },
    headers: {
      "X-RapidAPI-Key": "0a72b69bd8msh595a3869eeb0604p1f159ejsn5f9c7f0b9acd",
      "X-RapidAPI-Host": "watchmode.p.rapidapi.com",
    },
  };

  let streamingResponse = {};
  let streamingServices = {};
  const getStreamingServices = async (streamingTitle, streamingType) => {
    try {
      if (!api && streamingTitle && streamingType) {
        // Search for the movie title and get the Watchmode ID.
        const searchResponse = await axios.request(searchOptions);
        const watchmodeId = searchResponse.data.title_results[0].id;

        // Get the streaming services for the movie using the Watchmode ID.
        const streamingOptions = {
          method: "GET",
          url: `https://watchmode.p.rapidapi.com/title/${watchmodeId}/sources/`,
          params: {
            regions: "US",
          },
          headers: {
            "X-RapidAPI-Key":
              "0a72b69bd8msh595a3869eeb0604p1f159ejsn5f9c7f0b9acd",
            "X-RapidAPI-Host": "watchmode.p.rapidapi.com",
          },
        };

        streamingResponse = await axios.request(streamingOptions);
        streamingResponse = streamingResponse.data;

        streamingServices = streamingResponse.reduce(
          (accumulator, currentValue) => {
            accumulator[currentValue.name] = currentValue.web_url;
            return accumulator;
          },
          {}
        );

        setObj(streamingServices);
      }
    } catch (error) {
      console.log(error);
    }
    setApi(true);
  };

  const fetchMovie = async () => {
    const { error, movie } = await getSingleMovie(movieId);

    if (error) {
      return updateNotification("error", error);
    }

    setReady(true);
    setMovie(movie);
  };

  const handleOnRateMovie = () => {
    if (!isLoggedIn) return navigate("/auth/signin");
    setShowRatingModal(true);
  };

  const hideRatingModal = () => {
    setShowRatingModal(false);
  };

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  const hideProfileModal = () => {
    setShowProfileModal(false);
  };

  const handleOnRatingSuccess = (reviews) => {
    setMovie({ ...movie, reviews: { ...reviews } });
  };

  useEffect(() => {
    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  useEffect(() => {
    if (streamingTitle && streamingType) {
      getStreamingServices(streamingTitle, streamingType);
    }
  }, [streamingTitle, streamingType]);

  if (!ready)
    return (
      <div className="h-screen flex justify-center items-center dark:bg-primary bg-custom-gray">
        <p className="text-primary dark:text-custom-gray font-semibold font-mono animate-pulse">
          Please wait
        </p>
      </div>
    );

  return (
    <div className="dark:bg-primary bg-custom-gray min-h-screen pb-10">
      <Container className="xl:px-0 px-2">
        <video poster={poster} controls src={trailer}></video>
        <div className="flex justify-between">
          <h1 className="xl:text-4xl lg:text-3xl text-2xl  text-highlight dark:text-highlight-dark font-bold py-3">
            {title}
          </h1>
          <div className="flex flex-col items-end">
            <RatingStar rating={reviews.ratingAvg} />
            <CustomButtonLink
              label={convertReviewCount(reviews.reviewCount) + " Reviews"}
              onClick={() => navigate("/movie/reviews/" + id)}
            />
            <CustomButtonLink
              label="Rate the movie"
              onClick={handleOnRateMovie}
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-primary dark:text-custom-gray font-semibold font-mono pt-2 pb-2 pr-2">
            {storyLine}
          </p>
          <ListWithLabel label="Directors:">
            {directors.map((d, index) => (
              <CustomButtonLinkBullet
                onClick={() => handleProfileClick(d)}
                key={d.id}
                label={d.name}
                hasBullet={index !== directors.length - 1}
              />
            ))}
          </ListWithLabel>

          <ListWithLabel label="Writers:">
            {writers.map((w, index) => (
              <CustomButtonLinkBullet
                onClick={() => handleProfileClick(w)}
                key={w.id}
                label={w.name}
                hasBullet={index !== writers.length - 1}
              />
            ))}
          </ListWithLabel>

          <ListWithLabel label="Lead Actors:">
            {cast.map(({ id, profile, leadActor, index }) => {
              return leadActor ? (
                <CustomButtonLinkBullet
                  onClick={() => handleProfileClick(profile)}
                  label={profile.name}
                  key={id}
                  hasBullet={index !== cast.length - 1}
                />
              ) : null;
            })}
          </ListWithLabel>

          <ListWithLabel label="Language:">
            <CustomButtonLink label={language} clickable={false} />
          </ListWithLabel>

          <ListWithLabel label="Release Date:">
            <CustomButtonLink
              label={convertDate(releaseDate)}
              clickable={false}
            />
          </ListWithLabel>

          <ListWithLabel label="Genres:">
            {genres.map((g, index) => (
              <CustomButtonLinkBullet
                label={g}
                key={g}
                clickable={false}
                hasBullet={index !== genres.length - 1}
              />
            ))}
          </ListWithLabel>

          <ListWithLabel label="Type:">
            <CustomButtonLink label={type} clickable={false} />
          </ListWithLabel>

          <ListWithLabel label="Film Rating:">
            <CustomButtonLink label={filmRating} clickable={false} />
          </ListWithLabel>

          {Object.keys(obj).length > 0 && (
            <ListWithLabel label="Streaming Services:">
              <StreamingServices services={obj} />
            </ListWithLabel>
          )}

          <CastProfiles cast={cast} />
          <RelatedMovies movieId={movieId} />
        </div>
      </Container>

      <ProfileModal
        visible={showProfileModal}
        onClose={hideProfileModal}
        profileId={selectedProfile.id}
      />

      <AddRatingModal
        visible={showRatingModal}
        onClose={hideRatingModal}
        onSuccess={handleOnRatingSuccess}
      />
    </div>
  );
}

const ListWithLabel = ({ children, label }) => {
  return (
    <div className="flex space-x-2">
      <p className="text-primary dark:text-custom-gray font-bold font-mono">
        {label}
      </p>
      {children}
    </div>
  );
};

const StreamingServices = ({ services }) => {
  const formatServiceName = (name) => {
    const words = name.split(" ");
    const formattedWords = words.map((word) => {
      const lowercaseWord = word.toLowerCase();
      return lowercaseWord.charAt(0).toUpperCase() + lowercaseWord.slice(1);
    });
    return formattedWords.join(" ");
  };

  const renderServiceLinks = () => {
    return Object.entries(services).map(([serviceName, serviceLink], index) => (
      <React.Fragment key={serviceName}>
        {index !== 0 && ", "}
        <a href={serviceLink} target="_blank" rel="noopener noreferrer">
          {formatServiceName(serviceName)}
        </a>
      </React.Fragment>
    ));
  };

  return <CustomButtonLink label={renderServiceLinks()} clickable={false} />;
};

const CastProfiles = ({ cast, onProfileClick }) => {
  return (
    <div className="">
      <h1 className="text-primary dark:text-custom-gray font-semibold font-mono text-2xl mb-2">
        Cast:
      </h1>
      <div className="flex flex-wrap space-x-4">
        {cast.map(({ id, profile, roleAs }) => {
          return (
            <div
              key={id}
              className="basis-28 flex flex-col items-center text-center mb-4"
            >
              <img
                className="w-24 h-24 aspect-square object-cover rounded-full"
                src={profile.profile}
                alt=""
              />

              <CustomButtonLink label={profile.name} />
              <span className="text-primary dark:text-custom-gray font-semibold font-mono text-sm">
                as
              </span>
              <p className="text-primary dark:text-custom-gray font-semibold font-mono">
                {roleAs}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

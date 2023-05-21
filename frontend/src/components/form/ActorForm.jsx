import React, { useEffect, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { useNotification } from "../../hooks";
import { commonInputClasses } from "../../utils/theme";
import PosterSelector from "../PosterSelector";
import Selector from "../Selector";
import Label from "../Label";

const defaultActorInfo = {
  name: "",
  dob: "",
  about: "",
  profile: null,
  gender: "",
  died: "",
};

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
  { title: "Other", value: "other" },
];

const validateActor = ({ name, dob, gender, about, profile, died }) => {
  if (!name.trim()) {
    return { error: "Actor name missing!" };
  }

  if (!dob.trim()) {
    return { error: "Date of Birth missing!" };
  }

  if (!gender.trim()) {
    return { error: "Actor gender missing!" };
  }

  if (!about.trim()) {
    return { error: "About section is empty!" };
  }

  if (profile && !profile.type?.startsWith("image")) {
    return { error: "Invalid image!" };
  }

  return { error: null };
};

export default function ActorForm({
  title,
  initialState,
  btnTitle,
  busy,
  onSubmit,
}) {
  const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo });
  const [selectedProfileForUI, setSelectedProfileForUI] = useState("");
  const { updateNotification } = useNotification();

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedProfileForUI(url);
  };

  const handleChange = ({ target }) => {
    const { value, files, name } = target;

    if (name === "profile") {
      const file = files[0];
      updatePosterForUI(file);

      return setActorInfo({ ...actorInfo, profile: file });
    }

    setActorInfo({ ...actorInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { error } = validateActor(actorInfo);

    if (error) {
      return updateNotification("error", error);
    }

    const formData = new FormData();

    for (let key in actorInfo) {
      if (key) {
        formData.append(key, actorInfo[key]);
      }
    }
    onSubmit(formData);
  };

  const handleOnChange = ({ target }) => {
    const { checked, name, value } = target;

    if (name === "died") {
      return setActorInfo({ ...actorInfo, died: checked });
    }

    setActorInfo({ ...actorInfo, [name]: value });
  };

  useEffect(() => {
    if (initialState) {
      setActorInfo({ ...initialState, profile: null });
      setSelectedProfileForUI(initialState.profile);
    }
  }, [initialState]);

  const { name, dob, gender, about, died } = actorInfo;

  return (
    <form
      className="dark:bg-primary bg-custom-gray p-3 w-[35rem] rounded"
      onSubmit={handleSubmit}
    >
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-semibold text-xl dark:text-custom-gray text-primary">
          {title}
        </h1>
        <button
          className="h-8 w-24 bg-primary text-custom-gray dark:bg-custom-gray dark:text-primary hover:opacity-80 transition rounded flex items-center justify-center"
          type="submit"
        >
          {busy ? <ImSpinner3 className="animate-spin" /> : btnTitle}
        </button>
      </div>

      <div className="flex space-x-2">
        <PosterSelector
          selectedPoster={selectedProfileForUI}
          className="w-36 h-36 aspect-square object-cover"
          name="profile"
          onChange={handleChange}
          lable="Select profile"
          accept="image/jpg, image/jpeg, image/png"
        />

        <div className="flex-grow flex flex-col space-y-2">
          <input
            placeholder="Name"
            type="text"
            className={commonInputClasses + " border-b-2"}
            name="name"
            value={name}
            onChange={handleChange}
          />

          <textarea
            name="about"
            value={about}
            onChange={handleChange}
            placeholder="About"
            className={commonInputClasses + " border-b-2 resize-none h-full"}
          ></textarea>
        </div>
      </div>

      <div className="mt-3">
        <Selector
          options={genderOptions}
          label="Gender"
          value={gender}
          onChange={handleChange}
          name="gender"
        />
      </div>

      <Label htmlFor="title">Date of Birth:</Label>
      <input
        type="date"
        className={
          commonInputClasses +
          "border-2 text-primary dark:text-custom-gray rounded w-auto pl-2 pr-7"
        }
        name="dob"
        id="dob"
        value={dob}
        onChange={handleChange}
      />

      <Label htmlFor="title">Died?</Label>
      <input
        type="checkbox"
        name="died"
        className="w-4 h-4 p-20"
        checked={died}
        onChange={handleOnChange}
        title="Died"
      />
    </form>
  );
}

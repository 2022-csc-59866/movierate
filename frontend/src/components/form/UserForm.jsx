import React, { useEffect, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { useNotification } from "../../hooks";
import { commonInputClasses } from "../../utils/theme";
import Selector from "../Selector";
import Label from "../Label";
import { roleOptions } from "../../utils/options";

const defaultUserInfo = {
  name: "",
  email: "",
  role: "",
  googleId: "",
  githubId: "",
};

const validateUser = ({ name, email, role }) => {
  if (!name.trim()) {
    return { error: "User name missing!" };
  }

  if (!email.trim()) {
    return { error: "User email missing!" };
  }

  if (!role.trim()) {
    return { error: "User role missing!" };
  }
  return { error: null };
};

export default function UserForm({
  title,
  initialState,
  btnTitle,
  busy,
  onSubmit,
}) {
  const [userInfo, setUserInfo] = useState({ ...defaultUserInfo });
  const { updateNotification } = useNotification();

  const handleChange = ({ target }) => {
    const { value, name } = target;

    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { error } = validateUser(userInfo);

    if (error) {
      return updateNotification("error", error);
    }

    const formData = {};

    for (let key in userInfo) {
      if (key) {
        formData[key] = userInfo[key];
      }
    }

    onSubmit(formData);
  };

  useEffect(() => {
    if (initialState) {
      setUserInfo({ ...initialState });
    }
  }, [initialState]);

  const { name, email, role, googleId, githubId } = userInfo;

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
        <div className="flex-grow flex flex-col space-y-2">
          <Label htmlFor="title">Name</Label>
          <input
            placeholder="Name"
            type="text"
            className={commonInputClasses + " border-b-2"}
            name="name"
            value={name}
            onChange={handleChange}
          />
          <Label htmlFor="title">Email</Label>
          <input
            placeholder="Email"
            type="text"
            className={commonInputClasses + " border-b-2"}
            name="email"
            value={email}
            onChange={handleChange}
          />
          <Label htmlFor="title">Google ID</Label>
          <input
            placeholder={googleId === "" ? "N/A" : googleId}
            type="text"
            className={commonInputClasses + " border-b-2"}
            name="googleId"
            value={googleId}
            onChange={handleChange}
          />
          <Label htmlFor="title">Github ID</Label>
          <input
            placeholder={githubId === "" ? "N/A" : githubId}
            type="text"
            className={commonInputClasses + " border-b-2"}
            name="githubId"
            value={githubId}
            onChange={handleChange}
          />
          <Label htmlFor="title">Role</Label>
          <Selector
            options={roleOptions}
            label="Role"
            value={role}
            onChange={handleChange}
            name="role"
          />
        </div>
      </div>
    </form>
  );
}

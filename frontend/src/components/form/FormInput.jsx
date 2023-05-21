import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function FormInput({ type, name, label, placeholder, ...rest }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const inputType =
    type === "password" ? (passwordVisible ? "text" : "password") : type;

  return (
    <div className="flex flex-col-reverse">
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          className="bg-transparent rounded border-2 dark:border-custom-gray border-light-subtle dark:focus:border-custom-gray focus:border-primary w-full text-lg outline-none p-1 dark:text-custom-gray peer transition"
          placeholder={placeholder}
          {...rest}
        />
        {type === "password" && (
          <span
            onClick={togglePasswordVisibility}
            className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {passwordVisible ? (
              <FaEyeSlash
                className="text-green-600 dark:text-green-300"
                size={20}
              />
            ) : (
              <FaEye className="text-green-600 dark:text-green-300" size={20} />
            )}
          </span>
        )}
      </div>
      <label
        className="font-semibold dark:text-custom-gray text-primary dark:peer-focus:text-custom-gray peer-focus:text-primary transition self-start"
        htmlFor={name}
      >
        {label}
      </label>
    </div>
  );
}

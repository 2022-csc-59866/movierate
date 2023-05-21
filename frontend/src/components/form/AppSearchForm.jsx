import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const style =
  "dark:border-dark-subtle border-light-subtle dark:focus:border-custom-gray focus:border-primary dark:text-custom-gray text-lg rounded-3xl dark:border-custom-gray border-primary";

export default function AppSearchForm({
  showResetIcon,
  placeholder,
  onSubmit,
  onReset,
  styleClassName = style,
}) {
  const [value, setValue] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  const handleReset = () => {
    setValue("");
    onReset();
  };

  return (
    <form className="relative" onSubmit={handleOnSubmit}>
      <input
        type="text"
        className={
          "border-2 transition bg-transparent rounded text-lg p-1 outline-none" +
          styleClassName
        }
        placeholder={placeholder}
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />

      {showResetIcon ? (
        <button
          onClick={handleReset}
          type="button"
          className="absolute top-1/2 -translate-y-1/2 right-2 text-primary dark:text-custom-gray"
        >
          <AiOutlineClose />
        </button>
      ) : null}
    </form>
  );
}

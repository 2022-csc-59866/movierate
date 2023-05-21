import React from "react";
import { ImSpinner8 } from "react-icons/im";

export default function Submit({
  value,
  busy,
  isButtonDisabled,
  type,
  onClick,
}) {
  return (
    <button
      type={type || "submit"}
      className="w-full rounded dark:bg-custom-gray bg-secondary dark:text-secondary text-custom-gray hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer h-10 flex items-center justify-center"
      disabled={isButtonDisabled}
      onClick={onClick}
    >
      {busy ? <ImSpinner8 className="animate-spin" /> : value}
    </button>
  );
}

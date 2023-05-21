import React from "react";

export default function Title({ children }) {
  return (
    <h1 className="text-xl dark:text-custom-gray text-secondary font-semibold text-center font-mono">
      {children}
    </h1>
  );
}

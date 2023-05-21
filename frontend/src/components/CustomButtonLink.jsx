import React from "react";

export default function CustomButtonLink({ label, clickable = true, onClick }) {
  const className = clickable
    ? "text-highlight dark:text-highlight-dark hover:underline font-semibold font-mono"
    : "text-highlight dark:text-highlight-dark cursor-default font-semibold font-mono";

  return (
    <button onClick={onClick} className={className} type="button">
      {label}
    </button>
  );
}

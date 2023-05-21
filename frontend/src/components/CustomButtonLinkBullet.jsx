import React from "react";

export default function CustomButtonLink({
  label,
  clickable = true,
  onClick,
  hasBullet = false,
}) {
  const className = clickable
    ? "text-highlight dark:text-highlight-dark hover:underline font-semibold font-mono"
    : "text-highlight dark:text-highlight-dark cursor-default font-semibold font-mono";

  const bulletSymbol = hasBullet ? " &#x2022;" : "";

  return (
    <button
      onClick={onClick}
      className={className}
      type="button"
      dangerouslySetInnerHTML={{ __html: label + bulletSymbol }}
    />
  );
}

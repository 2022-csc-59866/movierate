import React from "react";
import { Link } from "react-router-dom";

export default function CustomLink({ to, children }) {
  return (
    <Link
      className="dark:text-custom-gray text-primary dark:hover:text-custom-gray hover:text-primary transition"
      to={to}
    >
      {children}
    </Link>
  );
}

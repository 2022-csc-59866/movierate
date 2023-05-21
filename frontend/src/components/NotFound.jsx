import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="text-center text-red-600 text-3xl font-mono ">
      <Link to="/">
        <div className="flex justify-center items-center">
          <img src="./404.png" alt="404" className="h-auto w-auto" />
        </div>
      </Link>
      <h1>404 - Page Not Found!</h1>
      <p>
        The requested URL <code>{location.pathname}</code> was not found.
      </p>
      <p className="underline">
        <Link to="/">Go to Home</Link>
      </p>
    </div>
  );
}

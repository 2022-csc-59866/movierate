import React from "react";
import { AiFillStar } from "react-icons/ai";

export default function RatingStar({ rating }) {
  if (!rating)
    return (
      <p className="text-highlight dark:text-highlight-dark font-mono">
        No reviews
      </p>
    );

  return (
    <p className="text-highlight dark:text-highlight-dark flex items-center space-x-1 font-mono">
      <span>{rating}</span>
      <AiFillStar />
    </p>
  );
}

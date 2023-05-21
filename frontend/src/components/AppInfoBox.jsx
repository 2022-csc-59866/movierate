import React from "react";

export default function AppInfoBox({ title, subTitle }) {
  return (
    <div className="bg-white dark:bg-secondary shadow dark:shadow  p-5 rounded">
      <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-custom-gray">
        {title}
      </h1>
      <p className="text-xl text-primary dark:text-custom-gray font-mono">
        {subTitle}
      </p>
    </div>
  );
}

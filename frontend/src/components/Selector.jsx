import React from "react";

export default function Selector({ name, options, value, label, onChange }) {
  return (
    <select
      className="border-2 bg-primary dark:bg-custom-gray dark:border-custom-gray border-primary dark:focus:border-custom-gold focus:border-custom-gold dark:hover:border-custom-gold hover:border-custom-gold p-1 pr-10 outline-none transition rounded bg-transparent text-custom-gray dark:text-primary dark:focus:text-primary focus:text-custom-gray font-mono"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value="">{label}</option>
      {options.map(({ title, value }) => {
        return (
          <option key={title} value={value}>
            {title}
          </option>
        );
      })}
    </select>
  );
}

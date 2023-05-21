const Label = ({ children, htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="dark:text-custom-gray text-primary font-semibold font-mono"
    >
      {children}
    </label>
  );
};

export default Label;

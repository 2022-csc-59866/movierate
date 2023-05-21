import Label from "./Label";

const LabelWithBadge = ({ children, htmlFor, badge = 0 }) => {
  const renderBadge = () => {
    if (!badge) return null;
    return (
      <span className="dark:bg-custom-gray bg-primary dark:text-primary text-custom-gray absolute top-0 right-0 translate-x-5 -translate-y-1 text-xs w-5 h-5 rounded-full flex justify-center items-center">
        {badge <= 10 ? badge : "10+"}
      </span>
    );
  };

  return (
    <div className="relative">
      <Label htmlFor={htmlFor}>{children}</Label>
      {renderBadge()}
    </div>
  );
};

export default LabelWithBadge;

const ViewAllBtn = ({ visible, children, onClick }) => {
  if (!visible) return null;
  return (
    <button
      onClick={onClick}
      type="button"
      className="dark:text-custom-gray text-primary hover:underline transition"
    >
      {children}
    </button>
  );
};

export default ViewAllBtn;

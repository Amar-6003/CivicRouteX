const Button = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
  onClick,
  disabled = false,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-300",

    secondary:
      "border border-teal-200 bg-white text-teal-700 hover:bg-teal-50",

    danger:
      "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-200 hover:-translate-y-0.5",

    ghost:
      "text-slate-600 hover:bg-teal-50 hover:text-teal-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
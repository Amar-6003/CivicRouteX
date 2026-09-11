const Input = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
  required = false,
  error,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full rounded-xl border bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 ${
          error ? "border-red-500" : "border-slate-200"
        }`}
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
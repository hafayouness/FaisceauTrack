export default function Input({
  label,
  error,
  required,
  className = "",
  ...props
}) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        className={`form-input ${error ? "error" : ""} ${className}`}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

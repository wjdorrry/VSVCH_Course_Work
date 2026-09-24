export default function FormField({ label, hint, children }) {
  return (
    <label className="form-field">
      <span className="form-label">{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

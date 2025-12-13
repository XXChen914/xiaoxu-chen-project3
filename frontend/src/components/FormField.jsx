export default function FormField({
  id,
  label,
  type = "text",
  name,
  placeholder,
  required = true,
  value,
  onChange,
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name ?? id}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
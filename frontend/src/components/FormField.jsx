export default function FormField({
  id,
  label,
  type = "text",
  name,
  placeholder,
  required = true,
}) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name ?? id}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </>
  );
}

export function FormField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  required = false,
}) {
  const fieldError = Array.isArray(error) ? error[0] : error;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 shadow-xs transition outline-none placeholder:text-slate-400 focus:ring-2 ${
          fieldError
            ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-indigo-200'
        }`}
      />
      {fieldError ? <p className="text-xs font-medium text-rose-600">{fieldError}</p> : null}
    </div>
  );
}

export function Alert({ variant = 'error', children }) {
  const styles =
    variant === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : 'border-rose-200 bg-rose-50 text-rose-800';

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`} role="alert">
      {children}
    </div>
  );
}


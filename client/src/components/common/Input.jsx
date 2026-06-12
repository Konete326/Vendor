export default function Input({
  label,
  error,
  className = '',
  options,
  ...rest
}) {
  const inputClasses = `w-full bg-app-muted border border-app-input-border text-app-text rounded-lg px-3 py-2 focus:outline-none focus:border-teal-400 transition-colors ${error ? 'border-red-500' : ''} ${className}`

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-app-text-secondary mb-1">
          {label}
        </label>
      )}

      {rest.type === 'select' && options ? (
        <select className={inputClasses} {...rest}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input className={inputClasses} {...rest} />
      )}

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  )
}

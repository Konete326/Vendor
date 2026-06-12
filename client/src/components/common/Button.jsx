const variantStyles = {
  primary: 'bg-teal-500 hover:bg-teal-600 text-white',
  secondary: 'bg-app-muted hover:bg-app-border text-app-text-secondary',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}) {
  return (
    <button
      className={`rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

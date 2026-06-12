export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-app-panel rounded-xl p-6 border border-app-border ${className}`}>
      {children}
    </div>
  )
}

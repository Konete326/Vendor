import { useAuth } from '../context/AuthContext'
import Card from '../components/common/Card'

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  const fields = [
    { label: 'Name', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Role', value: user.role },
    { label: 'User ID', value: user._id },
  ]

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-app-text">My Profile</h1>
        <p className="text-app-text-secondary text-sm mt-1">View your account details.</p>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-xl font-bold text-white">
            {user.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-app-text">{user.name}</p>
            <p className="text-sm text-app-text-secondary capitalize">{user.role}</p>
          </div>
        </div>

        <dl className="space-y-4">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1 pb-4 border-b border-app-border last:border-0 last:pb-0">
              <dt className="text-xs font-medium text-app-text-secondary uppercase tracking-wide">{label}</dt>
              <dd className="text-app-text">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  )
}

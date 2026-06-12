import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppLayout({ title }) {
  return (
    <div className="min-h-screen bg-app-bg flex">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <Header title={title} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

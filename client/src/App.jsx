import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import GuestRoute from './components/common/GuestRoute'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import PartsPage from './pages/parts/PartsPage'
import AddPartPage from './pages/parts/AddPartPage'
import EditPartPage from './pages/parts/EditPartPage'
import StockPage from './pages/stock/StockPage'
import AddStockPage from './pages/stock/AddStockPage'
import JumpsPage from './pages/jumps/JumpsPage'
import AddJumpPage from './pages/jumps/AddJumpPage'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/parts" element={<PartsPage />} />
                <Route path="/parts/add" element={<AddPartPage />} />
                <Route path="/parts/:id/edit" element={<EditPartPage />} />
                <Route path="/stock" element={<StockPage />} />
                <Route path="/stock/add" element={<AddStockPage />} />
                <Route path="/jumps" element={<JumpsPage />} />
                <Route path="/jumps/add" element={<AddJumpPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App

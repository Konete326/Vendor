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
import BikesPage from './pages/bikes/BikesPage'
import MaterialConfigPage from './pages/rawMaterials/MaterialConfigPage'
import StockControlPage from './pages/rawMaterials/StockControlPage'
import AssemblyPage from './pages/assemble/AssemblyPage'
import AssembleHistoryPage from './pages/assemble/AssembleHistoryPage'
import POSDashboardPage from './pages/pos/POSDashboardPage'
import SalesHistoryPage from './pages/sales/SalesHistoryPage'

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
                <Route path="/bikes/category" element={<BikesPage />} />
                <Route path="/bikes/raw-material" element={<MaterialConfigPage />} />
                <Route path="/bikes/raw-material-inventory" element={<StockControlPage />} />
                <Route path="/bikes/assemble" element={<AssemblyPage />} />
                <Route path="/bikes/assemble-history" element={<AssembleHistoryPage />} />
                <Route path="/pos" element={<POSDashboardPage />} />
                <Route path="/sales-history" element={<SalesHistoryPage />} />
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

import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { useAuthStore } from './store/useAuthStore.js'
// import { useThemeStore } from './store/useThemeStore.js'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()
  // const { theme } = useThemeStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <div>
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path='/settings' element={<SettingsPage />} />
          <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
      <Toaster position='bottom-center' />
    </div>
  )
}

export default App

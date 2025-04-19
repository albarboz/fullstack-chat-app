import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore.js'
import { useSocketStore } from './store/useSocketStore.js'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ContactRequestsPage from './pages/ContactRequestsPage.jsx'
import FindContactsPage from './pages/FindContactsPage.jsx'


const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
  const { connect, disconnect } = useSocketStore()


  // ✅ Call checkAuth once on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // ✅ Connect/disconnect socket when authUser changes
  useEffect(() => {
    if (authUser) {
      connect(authUser._id)
    } else {
      disconnect()
    }
  }, [authUser])

  if (isCheckingAuth) return null // option

  return (
    <div>
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/contacts/requests' element={authUser ? <ContactRequestsPage /> : <Navigate to="/login" />} />
        <Route path='/contacts/find' element={authUser ? <FindContactsPage /> : <Navigate to="/login" />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster position='bottom-center' />
    </div>
  )
}

export default App

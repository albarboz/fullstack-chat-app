import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore.js'
import { useSocketStore } from './store/useSocketStore.js'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage/HomePage.jsx'
import SignupPage from './pages/SignupPage/SignupPage.jsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import SettingsPage from './pages/SettingsPage/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx'
import ContactRequestsPage from './pages/ContactRequestsPage/ContactRequestsPage.jsx'
import FindContactsPage from './pages/FindContactsPage/FindContactsPage.jsx'


const App = () => {
  // const { authUser, checkAuth, } = useAuthStore()
  const { connect, disconnect } = useSocketStore.getState()

  const authUser = useAuthStore((state) => state.authUser)
  const checkAuth = useAuthStore((state) => state.checkAuth)

  // ✅ Call checkAuth once on mount
  useEffect(() => {
    // console.log("[App] Checking authentication status...");
    // console.count("[HomePage] Render");

    checkAuth()
  }, [])


  // ✅ Connect/disconnect socket when authUser changes
  useEffect(() => {
    if (authUser) {
      // console.log(`[App] Authenticated as ${authUser.fullName} (${authUser._id}). Connecting socket...`);
      connect(authUser._id)
    } else {
      // console.log("[App] No authUser found. Disconnecting socket...");
      disconnect()
    }
  }, [authUser])

  // if (isCheckingAuth) return null 
  // console.count("[checkAuth] called");


  const RouteLogger = ({ name }) => {
    useEffect(() => {
      // console.log(`[Router] Rendering route: ${name}`);
    }, []);
    return null;
  };

  // console.log("authUser", authUser)

  return (
    <div>
      <Routes>
        <Route path='/' element={authUser ? <><RouteLogger name="HomePage" /><HomePage /></> : <Navigate to="/login" />} />
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

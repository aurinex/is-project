import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from './firebase'
import { AnimatePresence } from 'framer-motion'
import AuthPage from './components/AuthPage'
import HomePage from './components/HomePage'
import BasicSecurityModule from './components/BasicSecurityModule'
import PasswordSecurityModule from './components/PasswordSecurityModule'
import PhishingModule from './components/PhishingModule'
import WorkplaceSecurityModule from './components/WorkplaceSecurityModule'
import ProfilePage from './components/ProfilePage'
import './App.css'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--background-gradient)'
      }}>
        <div className="pulse-element" style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(67, 97, 238, 0.3)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '4px solid rgba(255, 255, 255, 0.5)',
            borderTopColor: '#fff',
            animation: 'rotate 1s linear infinite'
          }}></div>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
      <Route
        path="/"
          element={user ? <HomePage /> : <AuthPage />}
      />
      <Route
        path="/auth"
        element={user ? <Navigate to="/" /> : <AuthPage />}
      />
      <Route
        path="/profile"
        element={user ? <ProfilePage /> : <Navigate to="/auth" />}
      />
      <Route
        path="/basic-security"
        element={user ? <BasicSecurityModule /> : <Navigate to="/auth" />}
      />
      <Route
        path="/password-security"
        element={user ? <PasswordSecurityModule /> : <Navigate to="/auth" />}
      />
      <Route
        path="/phishing"
        element={user ? <PhishingModule /> : <Navigate to="/auth" />}
      />
      <Route
        path="/workplace-security"
        element={user ? <WorkplaceSecurityModule /> : <Navigate to="/auth" />}
      />
    </Routes>
    </AnimatePresence>
  )
}

export default App

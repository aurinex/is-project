import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from './firebase'
import AuthPage from './components/AuthPage'
import Header from './components/Header'
import BasicSecurityModule from './components/BasicSecurityModule'
import PasswordSecurityModule from './components/PasswordSecurityModule'
import PhishingModule from './components/PhishingModule'
import WorkplaceSecurityModule from './components/WorkplaceSecurityModule'
import './App.css'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <div>Загрузка...</div> // Можно добавить лоадер
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Header /> : <AuthPage />}
      />
      <Route
        path="/auth"
        element={user ? <Navigate to="/" /> : <AuthPage />}
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
  )
}

export default App

import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  async function signUp(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(cred.user, { displayName })
    }
    return cred
  }

  async function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function logInWithGoogle() {
    return signInWithPopup(auth, googleProvider)
  }

  async function logOut() {
    return signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, logIn, logInWithGoogle, logOut }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

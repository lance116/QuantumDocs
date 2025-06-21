"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  kyberPublicKey: string
  dilithiumPublicKey: string
}

interface Keys {
  kyber: {
    publicKey: string
    privateKey: string
  }
  dilithium: {
    publicKey: string
    privateKey: string
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [keys, setKeys] = useState<Keys | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("quantum_user")
    const keyData = localStorage.getItem("quantum_keys")

    if (userData && keyData) {
      setUser(JSON.parse(userData))
      setKeys(JSON.parse(keyData))
    }
    setIsLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem("quantum_user")
    localStorage.removeItem("quantum_keys")
    setUser(null)
    setKeys(null)
    // Redirect to home page after logout
    window.location.href = "/"
  }

  return {
    user,
    keys,
    isLoading,
    isAuthenticated: !!user && !!keys,
    logout,
  }
}

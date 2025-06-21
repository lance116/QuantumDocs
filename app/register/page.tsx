"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Shield, Eye, EyeOff, Key, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Generate random cryptographic keys
const generateRandomKey = (length: number) => {
  const chars = "0123456789abcdef"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false)
  const [keyGenProgress, setKeyGenProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const generateKeys = async () => {
    setIsGeneratingKeys(true)
    setKeyGenProgress(0)

    // Simulate Kyber key generation with variable timing
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400))
    setKeyGenProgress(35 + Math.random() * 15) // 35-50%

    await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300))
    setKeyGenProgress(52 + Math.random() * 8) // 52-60%

    // Simulate Dilithium key generation
    await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 500))
    setKeyGenProgress(78 + Math.random() * 12) // 78-90%

    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))
    setKeyGenProgress(100)

    // Generate realistic-looking random keys
    const keys = {
      kyber: {
        publicKey: generateRandomKey(128),
        privateKey: generateRandomKey(128),
      },
      dilithium: {
        publicKey: generateRandomKey(96),
        privateKey: generateRandomKey(144),
      },
    }

    localStorage.setItem("quantum_keys", JSON.stringify(keys))
    setIsGeneratingKeys(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match")
      return
    }

    setIsLoading(true)

    // Generate keys first
    await generateKeys()

    // Simulate registration
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Store user data
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      kyberPublicKey: JSON.parse(localStorage.getItem("quantum_keys") || "{}").kyber?.publicKey,
      dilithiumPublicKey: JSON.parse(localStorage.getItem("quantum_keys") || "{}").dilithium?.publicKey,
    }

    localStorage.setItem("quantum_user", JSON.stringify(userData))
    setIsLoading(false)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-10 w-10 text-purple-400" />
            <span className="text-3xl font-bold text-white">QuantumDocs</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-300">Join the quantum-secure document sharing platform</p>
        </div>

        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Register</CardTitle>
            <CardDescription className="text-gray-300">
              Create your account and generate quantum-safe keys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400"
                  required
                />
              </div>

              {isGeneratingKeys && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-purple-400" />
                    <span className="text-white text-sm">Generating quantum-safe keys...</span>
                  </div>
                  <Progress value={keyGenProgress} className="bg-gray-700" />
                  <div className="space-y-1 text-xs">
                    <div
                      className={`flex items-center space-x-2 ${keyGenProgress >= 50 ? "text-green-400" : "text-gray-400"}`}
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Kyber key pair generated</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${keyGenProgress >= 100 ? "text-green-400" : "text-gray-400"}`}
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Dilithium key pair generated</span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || isGeneratingKeys}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-400 hover:text-purple-300">
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

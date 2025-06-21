"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Key, FileText, Zap, Users, CheckCircle, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">QuantumDocs</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-300">Welcome, {user?.name}</span>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="text-white hover:text-purple-300">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/encrypt">
                    <Button variant="ghost" className="text-white hover:text-purple-300">
                      Encrypt
                    </Button>
                  </Link>
                  <Link href="/decrypt">
                    <Button variant="ghost" className="text-white hover:text-purple-300">
                      Decrypt
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
                    onClick={() => {
                      localStorage.removeItem("quantum_user")
                      localStorage.removeItem("quantum_keys")
                      window.location.reload()
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-purple-600/20 text-purple-300 border-purple-500/30">Quantum-Safe Encryption</Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Secure Document
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> Sharing</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Share sensitive documents with military-grade quantum encryption. Protect your income statements, addresses,
            and personal data with post-quantum cryptography.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link href="/encrypt">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                    <Lock className="mr-2 h-5 w-5" />
                    Encrypt Document
                  </Button>
                </Link>
                <Link href="/decrypt">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-purple-500 text-purple-300 hover:bg-purple-500/10 px-8 py-3"
                  >
                    <Key className="mr-2 h-5 w-5" />
                    Decrypt Document
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                    <Lock className="mr-2 h-5 w-5" />
                    Get Started
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-purple-500 text-purple-300 hover:bg-purple-500/10 px-8 py-3"
                  >
                    <Key className="mr-2 h-5 w-5" />
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-300 text-lg">Three simple steps to quantum-safe document sharing</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                  <Key className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="text-white">1. Key Generation</CardTitle>
                <CardDescription className="text-gray-300">
                  Generate Kyber & Dilithium key pairs for quantum-safe key exchange and digital signatures
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="text-white">2. Encrypt & Sign</CardTitle>
                <CardDescription className="text-gray-300">
                  Use Kyber to securely share an AES-GCM key, encrypt your document, then sign with Dilithium
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="text-white">3. Decrypt & Verify</CardTitle>
                <CardDescription className="text-gray-300">
                  Receiver uses Kyber to recover the shared key, decrypts with AES-GCM, and verifies the signature
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why QuantumDocs?</h2>
            <p className="text-gray-300 text-lg">Built for the quantum computing era</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Quantum-Safe</h3>
              <p className="text-gray-300">Protected against quantum computer attacks with post-quantum cryptography</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Any Document</h3>
              <p className="text-gray-300">Secure PDFs, images, and any file type with military-grade encryption</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Sharing</h3>
              <p className="text-gray-300">Simple, secure sharing without compromising on security</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Secure Your Documents?</h2>
          <p className="text-gray-300 text-lg mb-8">
            Join the future of secure document sharing with quantum-safe encryption
          </p>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                Get Started Now
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-purple-400" />
              <span className="text-white font-semibold">QuantumDocs</span>
            </div>
            <p className="text-gray-400 text-sm">© 2024 QuantumDocs. Quantum-safe document sharing.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

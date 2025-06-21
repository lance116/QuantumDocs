"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Upload, Key, Lock, FileText, Download, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/hooks/useAuth"

function EncryptPageContent() {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [receiverEmail, setReceiverEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const simulateEncryption = async () => {
    setIsProcessing(true)
    setProgress(0)

    // Simulate fetching recipient's public key (variable timing)
    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))
    setProgress(12 + Math.random() * 8) // 12-20%

    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))
    setProgress(28 + Math.random() * 7) // 28-35%

    // Simulate generating AES-GCM key
    await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 300))
    setProgress(45 + Math.random() * 10) // 45-55%

    // Simulate AES-GCM encryption of file
    await new Promise((resolve) => setTimeout(resolve, 900 + Math.random() * 400))
    setProgress(68 + Math.random() * 8) // 68-76%

    await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 200))
    setProgress(82 + Math.random() * 6) // 82-88%

    // Simulate Kyber encapsulation of AES key
    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 300))
    setProgress(92 + Math.random() * 4) // 92-96%

    // Simulate Dilithium signing
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300))
    setProgress(100)

    setIsProcessing(false)
    setStep(4)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">QuantumDocs</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user?.name}</span>
              <Link href="/decrypt">
                <Button variant="ghost" className="text-white hover:text-purple-300">
                  Decrypt
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Encrypt Document</h1>
          <p className="text-gray-300">Secure your sensitive documents with quantum-safe encryption</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? "bg-purple-600 text-white" : "bg-gray-600 text-gray-300"
                  }`}
                >
                  {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
                </div>
                {stepNum < 4 && (
                  <ArrowRight className={`w-4 h-4 mx-2 ${step > stepNum ? "text-purple-400" : "text-gray-500"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Upload Document */}
        {step === 1 && (
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload Document
              </CardTitle>
              <CardDescription className="text-gray-300">
                Select the sensitive document you want to encrypt and share securely
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-purple-400 mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="text-white cursor-pointer">
                    <span className="text-purple-400 hover:text-purple-300">Click to upload</span> or drag and drop
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.png,.txt"
                  />
                  <p className="text-sm text-gray-400">PDF, DOC, JPG, PNG up to 10MB</p>
                </div>
              </div>

              {file && (
                <div className="flex items-center space-x-2 p-3 bg-purple-600/20 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-400" />
                  <span className="text-white">{file.name}</span>
                  <Badge className="bg-purple-600/30 text-purple-300">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                </div>
              )}

              <Button
                onClick={() => setStep(2)}
                disabled={!file}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Recipient */}
        {step === 2 && (
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Key className="mr-2 h-5 w-5" />
                Select Recipient
              </CardTitle>
              <CardDescription className="text-gray-300">
                Choose a registered user to securely share your document with
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Available Recipients</Label>
                <div className="space-y-2">
                  {[
                    { id: "1", name: "Dr. Sarah Johnson", email: "sarah@hospital.com", role: "Medical Professional" },
                    { id: "2", name: "Mike Chen", email: "mike@accounting.com", role: "Accountant" },
                    { id: "3", name: "Lisa Rodriguez", email: "lisa@legal.com", role: "Legal Advisor" },
                  ].map((recipient) => (
                    <div
                      key={recipient.id}
                      onClick={() => setReceiverEmail(recipient.email)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        receiverEmail === recipient.email
                          ? "border-purple-500 bg-purple-600/20"
                          : "border-purple-500/30 bg-black/20 hover:bg-purple-600/10"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{recipient.name}</p>
                          <p className="text-gray-300 text-sm">{recipient.email}</p>
                          <p className="text-purple-400 text-xs">{recipient.role}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          <div>Kyber: ✓</div>
                          <div>Dilithium: ✓</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">
                  Optional Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Add a secure message for the recipient..."
                  className="bg-black/20 border-purple-500/30 text-white placeholder-gray-400"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!receiverEmail}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Encryption Process */}
        {step === 3 && (
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Quantum Encryption Process
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your document is being secured with post-quantum cryptography
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isProcessing && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-600/20 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Kyber Key Encapsulation</h4>
                      <p className="text-gray-300 text-sm">
                        Securely share AES-GCM key using post-quantum cryptography
                      </p>
                    </div>
                    <div className="p-4 bg-purple-600/20 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Dilithium Signatures</h4>
                      <p className="text-gray-300 text-sm">Quantum-resistant digital signatures</p>
                    </div>
                  </div>

                  <Button onClick={simulateEncryption} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Start Encryption
                  </Button>
                </div>
              )}

              {isProcessing && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Encryption Progress</span>
                      <span className="text-purple-400">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="bg-gray-700" />
                  </div>

                  <div className="space-y-2">
                    <div
                      className={`flex items-center space-x-2 ${progress >= 12 ? "text-green-400" : "text-gray-400"}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Fetching recipient's Kyber public key</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${progress >= 35 ? "text-green-400" : "text-gray-400"}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Generating AES-GCM symmetric key</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${progress >= 55 ? "text-green-400" : "text-gray-400"}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>AES-GCM encrypting document</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${progress >= 88 ? "text-green-400" : "text-gray-400"}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Kyber encapsulating AES key</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${progress >= 100 ? "text-green-400" : "text-gray-400"}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Dilithium signing package</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <Card className="bg-black/40 border-green-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                Document Encrypted Successfully
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your document has been secured and is ready for sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-600/20 rounded-lg border border-green-500/30">
                <h4 className="text-green-400 font-medium mb-2">Encryption Complete</h4>
                <p className="text-gray-300 text-sm">
                  Document encrypted with AES-GCM, key secured with Kyber encapsulation, and signed with Dilithium
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Download Package
                </Button>
                <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
                  Send Notification
                </Button>
              </div>

              <div className="text-center">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                    View in Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function EncryptPage() {
  return (
    <ProtectedRoute>
      <EncryptPageContent />
    </ProtectedRoute>
  )
}

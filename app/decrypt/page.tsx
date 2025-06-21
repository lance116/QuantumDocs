"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Shield, Upload, Key, Unlock, FileText, Download, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/hooks/useAuth"

// Generate random ciphertext
const generateRandomCiphertext = (length: number) => {
  const chars = "0123456789abcdef"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function DecryptPageContent() {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [packageFile, setPackageFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "failed">("pending")
  const [prefilledData, setPrefilledData] = useState<any>(null)
  const [isFromDashboard, setIsFromDashboard] = useState(false)

  useEffect(() => {
    const storedDocument = localStorage.getItem("decrypt_document")
    if (storedDocument) {
      const doc = JSON.parse(storedDocument)
      // Create a mock file object for the encrypted document
      const mockFile = new File(["encrypted content"], `${doc.name}.qpkg`, { type: "application/octet-stream" })
      setPackageFile(mockFile)
      setPrefilledData({
        fileName: doc.name,
        sender: doc.sender,
        senderEmail: doc.senderEmail,
        ciphertext: doc.ciphertext,
        size: doc.size,
        date: doc.date,
        id: doc.id,
      })
      setIsFromDashboard(true)
      // Clear the stored document
      localStorage.removeItem("decrypt_document")
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPackageFile(e.target.files[0])
    }
  }

  const simulateDecryption = async () => {
    setIsProcessing(true)
    setProgress(0)

    // Simulate extracting ciphertext from package (variable timing)
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 600))
    setProgress(8 + Math.random() * 12) // 8-20%

    await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300))
    setProgress(22 + Math.random() * 8) // 22-30%

    // Simulate Kyber decapsulation (ciphertext + private key → shared secret)
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700))
    setProgress(38 + Math.random() * 15) // 38-53%

    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))
    setProgress(58 + Math.random() * 12) // 58-70%

    // Simulate AES-GCM decryption using shared secret
    await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 500))
    setProgress(75 + Math.random() * 10) // 75-85%

    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))
    setProgress(88 + Math.random() * 7) // 88-95%

    // Simulate Dilithium signature verification
    await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 400))
    setProgress(100)
    setVerificationStatus("verified")

    // Mark document as decrypted if it came from dashboard
    if (isFromDashboard && prefilledData?.id) {
      localStorage.setItem("recently_decrypted", prefilledData.id.toString())
    }

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
              <Link href="/encrypt">
                <Button variant="ghost" className="text-white hover:text-purple-300">
                  Encrypt
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
          <h1 className="text-4xl font-bold text-white mb-4">Decrypt Document</h1>
          <p className="text-gray-300">Securely decrypt and verify your quantum-encrypted documents</p>
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

        {/* Step 1: Upload Package */}
        {step === 1 && (
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                {isFromDashboard ? "Document from Dashboard" : "Upload Encrypted Package"}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {isFromDashboard
                  ? "Document automatically loaded from your received documents"
                  : "Select the encrypted document package you received"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isFromDashboard && prefilledData ? (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-600/20 rounded-lg border border-purple-500/30">
                    <h4 className="text-white font-medium mb-2">Document Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">File:</span>
                        <span className="text-white">{prefilledData.fileName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">From:</span>
                        <span className="text-white">{prefilledData.sender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Size:</span>
                        <span className="text-white">{prefilledData.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Date:</span>
                        <span className="text-white">{prefilledData.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-600/20 rounded-lg border border-green-500/30">
                    <h4 className="text-green-400 font-medium mb-2">Kyber Ciphertext</h4>
                    <p className="text-gray-300 text-sm font-mono break-all">{prefilledData.ciphertext}</p>
                    <p className="text-gray-400 text-xs mt-2">
                      This ciphertext will be decapsulated using your private Kyber key to recover the AES-GCM key
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-purple-400 mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="package-upload" className="text-white cursor-pointer">
                      <span className="text-purple-400 hover:text-purple-300">Click to upload</span> or drag and drop
                    </Label>
                    <Input
                      id="package-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".qpkg,.enc"
                    />
                    <p className="text-sm text-gray-400">Encrypted package files (.qpkg, .enc)</p>
                  </div>
                </div>
              )}

              {packageFile && !isFromDashboard && (
                <div className="flex items-center space-x-2 p-3 bg-purple-600/20 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-400" />
                  <span className="text-white">{packageFile.name}</span>
                  <Badge className="bg-purple-600/30 text-purple-300">Encrypted</Badge>
                </div>
              )}

              <Button
                onClick={() => setStep(2)}
                disabled={!packageFile}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Load Private Keys */}
        {step === 2 && (
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Key className="mr-2 h-5 w-5" />
                Load Private Keys
              </CardTitle>
              <CardDescription className="text-gray-300">
                {isFromDashboard
                  ? `Decrypt document from ${prefilledData?.sender} using your private keys`
                  : "Your private keys are stored securely on your device"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-purple-600/20 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Kyber Private Key</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm font-mono">{generateRandomCiphertext(32)}...</span>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-gray-400 text-xs mt-1">Used for decapsulating the AES-GCM key from ciphertext</p>
                </div>

                <div className="p-4 bg-purple-600/20 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Dilithium Public Keys</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Dr. Sarah Johnson</span>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Mike Chen</span>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">Used for signature verification</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-600/20 rounded-lg border border-yellow-500/30">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-400 font-medium">Security Notice</h4>
                    <p className="text-gray-300 text-sm">
                      Private keys are stored locally and never transmitted to our servers
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
                >
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Decryption Process */}
        {step === 3 && (
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Unlock className="mr-2 h-5 w-5" />
                Quantum Decryption Process
              </CardTitle>
              <CardDescription className="text-gray-300">
                {isFromDashboard
                  ? `Decrypting ${prefilledData?.fileName} with post-quantum cryptography`
                  : "Decrypting and verifying your document with post-quantum cryptography"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isProcessing && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-600/20 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Kyber Decapsulation</h4>
                      <p className="text-gray-300 text-sm">Use ciphertext + private key to recover AES-GCM key</p>
                    </div>
                    <div className="p-4 bg-purple-600/20 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Signature Verification</h4>
                      <p className="text-gray-300 text-sm">Verify authenticity with Dilithium</p>
                    </div>
                  </div>

                  <Button onClick={simulateDecryption} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Start Decryption
                  </Button>
                </div>
              )}

              {isProcessing && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Decryption Progress</span>
                      <span className="text-purple-400">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="bg-gray-700" />
                  </div>

                  <div className="space-y-2">
                    <div
                      className={`flex items-center space-x-2 ${progress >= 20 ? "text-green-400" : "text-gray-400"}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Extracting ciphertext from package</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${progress >= 53 ? "text-green-400" : "text-gray-400"}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Recovering AES-GCM key (Kyber decapsulation)</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${progress >= 85 ? "text-green-400" : "text-gray-400"}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>AES-GCM decrypting with recovered key</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${progress >= 100 ? "text-green-400" : "text-gray-400"}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Verifying sender's Dilithium signature</span>
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
                Document Decrypted Successfully
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your document has been decrypted and signature verified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-600/20 rounded-lg border border-green-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <h4 className="text-green-400 font-medium">Signature Verified</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  Document authenticity confirmed. The sender's identity has been verified using Dilithium signatures.
                </p>
              </div>

              <div className="p-4 bg-purple-600/20 rounded-lg">
                <h4 className="text-white font-medium mb-2">Document Details</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Original filename:</span>
                    <span className="text-white">{prefilledData?.fileName || "sensitive-document.pdf"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">File size:</span>
                    <span className="text-white">{prefilledData?.size || "2.4 MB"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sender:</span>
                    <span className="text-white">{prefilledData?.sender || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Encrypted on:</span>
                    <span className="text-white">{prefilledData?.date || "Dec 21, 2024"}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Download className="mr-2 h-4 w-4" />
                Download Decrypted Document
              </Button>

              <div className="text-center">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                    Return to Dashboard
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

export default function DecryptPage() {
  return (
    <ProtectedRoute>
      <DecryptPageContent />
    </ProtectedRoute>
  )
}

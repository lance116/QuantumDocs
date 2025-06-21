"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, FileText, Download, Share, Search, Filter, Key, Lock, Unlock, Calendar, User } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

// Generate random ciphertext
const generateRandomCiphertext = (length: number) => {
  const chars = "0123456789abcdef"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const mockDocuments = [
  {
    id: 1,
    name: "Tax_Return_2024.pdf",
    type: "encrypted",
    size: "2.4 MB",
    date: "2024-12-20",
    recipient: "accountant@firm.com",
    status: "delivered",
  },
  {
    id: 2,
    name: "Medical_Records.pdf",
    type: "encrypted",
    size: "1.8 MB",
    date: "2024-12-19",
    recipient: "doctor@hospital.com",
    status: "pending",
  },
  {
    id: 3,
    name: "Bank_Statement.pdf",
    type: "decrypted",
    size: "956 KB",
    date: "2024-12-18",
    sender: "bank@institution.com",
    status: "verified",
  },
  {
    id: 4,
    name: "Insurance_Policy.pdf",
    type: "encrypted",
    size: "3.2 MB",
    date: "2024-12-17",
    recipient: "agent@insurance.com",
    status: "delivered",
  },
]

const initialReceivedDocuments = [
  {
    id: 1,
    name: "Medical_Test_Results.pdf",
    sender: "Dr. Sarah Johnson",
    senderEmail: "sarah@hospital.com",
    size: "1.2 MB",
    date: "2024-12-21",
    status: "pending",
    ciphertext: generateRandomCiphertext(96),
  },
  {
    id: 2,
    name: "Insurance_Claim.pdf",
    sender: "Mike Chen",
    senderEmail: "mike@insurance.com",
    size: "890 KB",
    date: "2024-12-20",
    status: "pending",
    ciphertext: generateRandomCiphertext(96),
  },
  {
    id: 3,
    name: "Legal_Document.pdf",
    sender: "Lisa Rodriguez",
    senderEmail: "lisa@legal.com",
    size: "2.1 MB",
    date: "2024-12-19",
    status: "decrypted",
    ciphertext: generateRandomCiphertext(96),
  },
]

function DashboardPageContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [receivedDocuments, setReceivedDocuments] = useState(initialReceivedDocuments)

  // Check for decryption completion and update status
  useEffect(() => {
    const checkDecryptionStatus = () => {
      const decryptedDocId = localStorage.getItem("recently_decrypted")
      if (decryptedDocId) {
        setReceivedDocuments((prev) =>
          prev.map((doc) => (doc.id.toString() === decryptedDocId ? { ...doc, status: "decrypted" } : doc)),
        )
        localStorage.removeItem("recently_decrypted")
      }
    }

    checkDecryptionStatus()

    // Check periodically in case user navigates back
    const interval = setInterval(checkDecryptionStatus, 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredDocuments = mockDocuments.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) && (activeTab === "all" || doc.type === activeTab),
  )

  const filteredReceivedDocuments = receivedDocuments.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDecryptDocument = (doc: any) => {
    // Store the complete document info for decryption
    localStorage.setItem(
      "decrypt_document",
      JSON.stringify({
        ...doc,
        fileName: doc.name.replace(".pdf", ""), // Remove extension for display
      }),
    )
    router.push("/decrypt")
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
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Lock className="mr-2 h-4 w-4" />
                  Encrypt
                </Button>
              </Link>
              <Link href="/decrypt">
                <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
                  <Unlock className="mr-2 h-4 w-4" />
                  Decrypt
                </Button>
              </Link>
              <Button variant="ghost" className="text-gray-300 hover:text-white" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-300">Manage your quantum-encrypted documents</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-300 text-sm whitespace-nowrap">Total Documents</p>
                  <p className="text-2xl font-bold text-white tabular-nums">
                    {mockDocuments.length + receivedDocuments.length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">Encrypted</p>
                  <p className="text-2xl font-bold text-white tabular-nums">
                    {mockDocuments.filter((doc) => doc.type === "encrypted").length}
                  </p>
                </div>
                <Lock className="h-8 w-8 text-green-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">Received</p>
                  <p className="text-2xl font-bold text-white tabular-nums">{receivedDocuments.length}</p>
                </div>
                <Download className="h-8 w-8 text-blue-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-yellow-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-white tabular-nums">
                    {receivedDocuments.filter((doc) => doc.status === "pending").length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/20 border-purple-500/30 text-white placeholder-gray-400"
            />
          </div>
          <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Document Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-black/40 border border-purple-500/30">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              My Documents
            </TabsTrigger>
            <TabsTrigger value="received" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Received Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-lg ${doc.type === "encrypted" ? "bg-green-600/20" : "bg-blue-600/20"}`}
                      >
                        {doc.type === "encrypted" ? (
                          <Lock className="h-5 w-5 text-green-400" />
                        ) : (
                          <Unlock className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{doc.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-300 mt-1">
                          <span>{doc.size}</span>
                          <span>{doc.date}</span>
                          {doc.recipient && (
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>To: {doc.recipient}</span>
                            </div>
                          )}
                          {doc.sender && (
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>From: {doc.sender}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={`${
                          doc.status === "delivered"
                            ? "bg-green-600/20 text-green-300 border-green-500/30"
                            : doc.status === "verified"
                              ? "bg-blue-600/20 text-blue-300 border-blue-500/30"
                              : "bg-yellow-600/20 text-yellow-300 border-yellow-500/30"
                        }`}
                      >
                        {doc.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="received" className="space-y-4">
            {filteredReceivedDocuments.map((doc) => (
              <Card key={doc.id} className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-lg ${doc.status === "decrypted" ? "bg-blue-600/20" : "bg-yellow-600/20"}`}
                      >
                        {doc.status === "decrypted" ? (
                          <Unlock className="h-5 w-5 text-blue-400" />
                        ) : (
                          <FileText className="h-5 w-5 text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{doc.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-300 mt-1">
                          <span>{doc.size}</span>
                          <span>{doc.date}</span>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>From: {doc.sender}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 font-mono">
                          Ciphertext: {doc.ciphertext.substring(0, 20)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={`${
                          doc.status === "pending"
                            ? "bg-yellow-600/20 text-yellow-300 border-yellow-500/30"
                            : "bg-green-600/20 text-green-300 border-green-500/30"
                        }`}
                      >
                        {doc.status}
                      </Badge>
                      {doc.status === "pending" ? (
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => handleDecryptDocument(doc)}
                        >
                          <Unlock className="mr-2 h-4 w-4" />
                          Decrypt
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Key Management Section */}
        <Card className="mt-8 bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Key className="mr-2 h-5 w-5" />
              Key Management
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your quantum-safe cryptographic keys (stored locally on your device)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-purple-600/20 rounded-lg">
                <h4 className="text-white font-medium mb-2">Kyber Key Pair</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Public Key:</span>
                    <span className="text-green-400">✓ Registered</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Private Key:</span>
                    <span className="text-blue-400">✓ Local Storage</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono break-all">Pub: {generateRandomCiphertext(24)}...</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-purple-500 text-purple-300 hover:bg-purple-500/10 mt-3"
                >
                  Regenerate Keys
                </Button>
              </div>
              <div className="p-4 bg-purple-600/20 rounded-lg">
                <h4 className="text-white font-medium mb-2">Dilithium Key Pair</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Public Key:</span>
                    <span className="text-green-400">✓ Registered</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Private Key:</span>
                    <span className="text-blue-400">✓ Local Storage</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono break-all">Pub: {generateRandomCiphertext(24)}...</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-purple-500 text-purple-300 hover:bg-purple-500/10 mt-3"
                >
                  Regenerate Keys
                </Button>
              </div>
            </div>

            <div className="p-4 bg-yellow-600/20 rounded-lg border border-yellow-500/30">
              <div className="flex items-start space-x-2">
                <Key className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-yellow-400 font-medium">Key Security</h4>
                  <p className="text-gray-300 text-sm">
                    Your private keys are stored locally and never leave your device. Public keys are shared with other
                    users for encryption and verification.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  )
}

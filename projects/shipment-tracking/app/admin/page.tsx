"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Package,
  Plus,
  Search,
  Edit,
  Eye,
  LogOut,
  Users,
  TrendingUp,
  Clock,
  Shield,
  BarChart3,
  Bell,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Shipment } from "@/lib/types"
import { getStatusColor, formatTrackingNumber } from "@/lib/utils/tracking"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const router = useRouter()

  const [createForm, setCreateForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    pickup_address: "",
    delivery_address: "",
    receiver_name: "",
    receiver_email: "",
    receiver_phone: "",
    receiver_address: "",
    package_name: "",
    package_weight: "",
    package_type: "general",
    insurance_amount: "",
    special_instructions: "",
  })

  const [updateForm, setUpdateForm] = useState({
    status: "",
    location: "",
    description: "",
  })

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchShipments()
    }
  }, [isAuthenticated])

  const checkAuth = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token")
      const adminEmail = localStorage.getItem("admin_email")

      if (adminToken && adminEmail) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("admin_token", data.token)
        localStorage.setItem("admin_email", data.user.email)
        localStorage.setItem("admin_name", data.user.name)

        setIsAuthenticated(true)
        alert("Login successful!")
      } else {
        alert("Login failed: " + (data.error || "Invalid credentials"))
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem("admin_token")
      localStorage.removeItem("admin_email")
      localStorage.removeItem("admin_name")

      setIsAuthenticated(false)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const fetchShipments = async () => {
    try {
      const response = await fetch("/api/shipments")
      const data = await response.json()
      if (data.shipments) {
        setShipments(data.shipments)
      }
    } catch (error) {
      console.error("Error fetching shipments:", error)
    }
  }

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      })

      const data = await response.json()

      if (data.success) {
        alert(`Shipment created! Tracking number: ${data.tracking_number}`)
        setIsCreateDialogOpen(false)
        setShipments((prevShipments) => [...prevShipments, data.shipment])
      } else {
        alert("Error creating shipment: " + data.error)
      }
    } catch (error) {
      alert("Error creating shipment. Please try again.")
    }
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedShipment) return

    try {
      const response = await fetch(`/api/shipments/${selectedShipment.tracking_number}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateForm),
      })

      const data = await response.json()

      if (data.success) {
        alert("Status updated successfully!")
        setIsUpdateDialogOpen(false)
        setUpdateForm({ status: "", location: "", description: "" })
        setSelectedShipment(null)
        fetchShipments()
      } else {
        alert("Error updating status: " + data.error)
      }
    } catch (error) {
      alert("Error updating status. Please try again.")
    }
  }

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.receiver_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.package_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    total: shipments.length,
    pending: shipments.filter((s) => s.current_status === "pending").length,
    in_transit: shipments.filter((s) => s.current_status === "in_transit").length,
    delivered: shipments.filter((s) => s.current_status === "delivered").length,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border border-slate-300">
          <CardHeader className="bg-slate-50 border-b border-slate-300">
            <div className="bg-blue-600 w-14 h-14 flex items-center justify-center mx-auto mb-4 border border-blue-700">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl text-center text-slate-900">Admin Login</CardTitle>
            <CardDescription className="text-center text-slate-600">Access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-slate-900 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="you@gmail.com"
                  required
                  className="mt-1 border border-slate-300 h-10"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-slate-900 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="hello3456789"
                  required
                  className="mt-1 border border-slate-300 h-10"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Login to Dashboard
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-300 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-16 py-3 sm:py-0 gap-3 sm:gap-0">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <span className="text-lg sm:text-xl font-bold text-slate-900">ShipTrack Pro</span>
                <div className="text-xs text-slate-600">Admin Dashboard</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-slate-600">
                Welcome, {localStorage.getItem("admin_name") || "Admin"}
              </span>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none border border-slate-300 bg-white text-sm px-2 sm:px-3 py-2 sm:py-2 h-auto"
                >
                  <Bell className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Notifications</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex-1 sm:flex-none border border-red-300 text-red-600 bg-white text-sm px-2 sm:px-3 py-2 h-auto"
                >
                  <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Welcome back, Admin</h1>
          <p className="text-sm sm:text-base text-slate-600">Manage shipments and monitor your logistics operations</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border border-slate-300">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600">Total Shipments</p>
                  <p className="text-xl sm:text-3xl font-bold text-blue-600">{stats.total}</p>
                  <p className="text-xs text-slate-500 mt-1">All time</p>
                </div>
                <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-blue-200 ml-auto sm:ml-0">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-300">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-xl sm:text-3xl font-bold text-blue-600">{stats.pending}</p>
                  <p className="text-xs text-slate-500 mt-1">Awaiting pickup</p>
                </div>
                <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-blue-200 ml-auto sm:ml-0">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-300">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600">In Transit</p>
                  <p className="text-xl sm:text-3xl font-bold text-blue-600">{stats.in_transit}</p>
                  <p className="text-xs text-slate-500 mt-1">On the way</p>
                </div>
                <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-blue-200 ml-auto sm:ml-0">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-300">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600">Delivered</p>
                  <p className="text-xl sm:text-3xl font-bold text-blue-600">{stats.delivered}</p>
                  <p className="text-xs text-slate-500 mt-1">Successfully completed</p>
                </div>
                <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-blue-200 ml-auto sm:ml-0">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-slate-300">
          <CardHeader className="bg-slate-50 border-b border-slate-300 p-3 sm:p-6">
            <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-blue-700">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-xl text-slate-900">Shipment Management</CardTitle>
                  <CardDescription className="hidden sm:block text-sm">
                    Manage all shipments and their statuses
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 gap-2">
                <div className="relative flex-1 sm:flex-none w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full border border-slate-300 text-sm h-10"
                  />
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Create
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl sm:max-w-4xl max-h-[90vh] overflow-y-auto p-3 sm:p-6">
                    <DialogHeader>
                      <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900">
                        Create New Shipment
                      </DialogTitle>
                      <DialogDescription className="text-slate-600">
                        Enter complete shipment details including receiver information
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateShipment} className="space-y-4 sm:space-y-6">
                      <Tabs defaultValue="sender" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
                          <TabsTrigger value="sender" className="flex items-center space-x-1">
                            <User className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Sender Info</span>
                            <span className="sm:hidden">Sender</span>
                          </TabsTrigger>
                          <TabsTrigger value="receiver" className="flex items-center space-x-1">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Receiver Info</span>
                            <span className="sm:hidden">Receiver</span>
                          </TabsTrigger>
                          <TabsTrigger value="package" className="flex items-center space-x-1">
                            <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Package Details</span>
                            <span className="sm:hidden">Package</span>
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="sender" className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="client_name" className="text-slate-900 font-medium text-sm">
                                Sender Name
                              </Label>
                              <Input
                                id="client_name"
                                value={createForm.client_name}
                                onChange={(e) => setCreateForm({ ...createForm, client_name: e.target.value })}
                                required
                                className="mt-2 border border-slate-300 text-sm"
                                placeholder="John Doe"
                              />
                            </div>
                            <div>
                              <Label htmlFor="client_email" className="text-slate-900 font-medium text-sm">
                                Sender Email
                              </Label>
                              <Input
                                id="client_email"
                                type="email"
                                value={createForm.client_email}
                                onChange={(e) => setCreateForm({ ...createForm, client_email: e.target.value })}
                                required
                                className="mt-2 border border-slate-300 text-sm"
                                placeholder="john@example.com"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="client_phone" className="text-slate-900 font-medium text-sm">
                              Sender Phone
                            </Label>
                            <Input
                              id="client_phone"
                              value={createForm.client_phone}
                              onChange={(e) => setCreateForm({ ...createForm, client_phone: e.target.value })}
                              required
                              className="mt-2 border border-slate-300 text-sm"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>

                          <div>
                            <Label htmlFor="pickup_address" className="text-slate-900 font-medium text-sm">
                              Pickup Address
                            </Label>
                            <Textarea
                              id="pickup_address"
                              value={createForm.pickup_address}
                              onChange={(e) => setCreateForm({ ...createForm, pickup_address: e.target.value })}
                              required
                              className="mt-2 border border-slate-300 text-sm"
                              placeholder="123 Main St, City, State, ZIP"
                              rows={3}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="receiver" className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="receiver_name" className="text-slate-900 font-medium text-sm">
                                Receiver Name
                              </Label>
                              <Input
                                id="receiver_name"
                                value={createForm.receiver_name}
                                onChange={(e) => setCreateForm({ ...createForm, receiver_name: e.target.value })}
                                required
                                className="mt-2 border border-slate-300 text-sm"
                                placeholder="Jane Smith"
                              />
                            </div>
                            <div>
                              <Label htmlFor="receiver_email" className="text-slate-900 font-medium text-sm">
                                Receiver Email
                              </Label>
                              <Input
                                id="receiver_email"
                                type="email"
                                value={createForm.receiver_email}
                                onChange={(e) => setCreateForm({ ...createForm, receiver_email: e.target.value })}
                                required
                                className="mt-2 border border-slate-300 text-sm"
                                placeholder="jane@example.com"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="receiver_phone" className="text-slate-900 font-medium text-sm">
                              Receiver Phone
                            </Label>
                            <Input
                              id="receiver_phone"
                              value={createForm.receiver_phone}
                              onChange={(e) => setCreateForm({ ...createForm, receiver_phone: e.target.value })}
                              required
                              className="mt-2 border border-slate-300 text-sm"
                              placeholder="+1 (555) 987-6543"
                            />
                          </div>

                          <div>
                            <Label htmlFor="receiver_address" className="text-slate-900 font-medium text-sm">
                              Receiver Address
                            </Label>
                            <Textarea
                              id="receiver_address"
                              value={createForm.receiver_address}
                              onChange={(e) => setCreateForm({ ...createForm, receiver_address: e.target.value })}
                              required
                              className="mt-2 border border-slate-300 text-sm"
                              placeholder="456 Oak Ave, City, State, ZIP"
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label htmlFor="delivery_address" className="text-slate-900 font-medium text-sm">
                              Delivery Address (if different)
                            </Label>
                            <Textarea
                              id="delivery_address"
                              value={createForm.delivery_address}
                              onChange={(e) => setCreateForm({ ...createForm, delivery_address: e.target.value })}
                              required
                              className="mt-2 border border-slate-300 text-sm"
                              placeholder="Same as receiver address or specify different address"
                              rows={3}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="package" className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="package_name" className="text-slate-900 font-medium text-sm">
                                Package Name
                              </Label>
                              <Input
                                id="package_name"
                                value={createForm.package_name}
                                onChange={(e) => setCreateForm({ ...createForm, package_name: e.target.value })}
                                required
                                className="mt-2 border border-slate-300 text-sm"
                                placeholder="Electronics, Documents, etc."
                              />
                            </div>
                            <div>
                              <Label htmlFor="package_weight" className="text-slate-900 font-medium text-sm">
                                Weight (lbs)
                              </Label>
                              <Input
                                id="package_weight"
                                type="number"
                                step="0.1"
                                value={createForm.package_weight}
                                onChange={(e) => setCreateForm({ ...createForm, package_weight: e.target.value })}
                                required
                                className="mt-2 border border-slate-300 text-sm"
                                placeholder="5.5"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="package_type" className="text-slate-900 font-medium text-sm">
                                Package Type
                              </Label>
                              <Select
                                value={createForm.package_type}
                                onValueChange={(value) => setCreateForm({ ...createForm, package_type: value })}
                              >
                                <SelectTrigger className="mt-2 border border-slate-300 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="general">General</SelectItem>
                                  <SelectItem value="fragile">Fragile</SelectItem>
                                  <SelectItem value="pet">Pet</SelectItem>
                                  <SelectItem value="international">International</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="insurance_amount" className="text-slate-900 font-medium text-sm">
                                Insurance Amount ($)
                              </Label>
                              <Input
                                id="insurance_amount"
                                type="number"
                                step="0.01"
                                value={createForm.insurance_amount}
                                onChange={(e) => setCreateForm({ ...createForm, insurance_amount: e.target.value })}
                                className="mt-2 border border-slate-300 text-sm"
                                placeholder="100.00"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="special_instructions" className="text-slate-900 font-medium text-sm">
                              Special Instructions
                            </Label>
                            <Textarea
                              id="special_instructions"
                              value={createForm.special_instructions}
                              onChange={(e) => setCreateForm({ ...createForm, special_instructions: e.target.value })}
                              className="mt-2 border border-slate-300 text-sm"
                              placeholder="Handle with care, fragile items, etc."
                              rows={3}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>

                      <Button
                        type="submit"
                        className="w-full h-10 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Complete Shipment
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="text-left p-2 sm:p-4 font-semibold text-slate-900">Tracking #</th>
                    <th className="text-left p-2 sm:p-4 font-semibold text-slate-900 hidden md:table-cell">Sender</th>
                    <th className="text-left p-2 sm:p-4 font-semibold text-slate-900 hidden lg:table-cell">Receiver</th>
                    <th className="text-left p-2 sm:p-4 font-semibold text-slate-900 hidden sm:table-cell">Package</th>
                    <th className="text-left p-2 sm:p-4 font-semibold text-slate-900">Status</th>
                    <th className="text-left p-2 sm:p-4 font-semibold text-slate-900 hidden md:table-cell">Created</th>
                    <th className="text-left p-2 sm:p-4 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-2 sm:p-4">
                        <div className="font-mono text-xs bg-slate-100 px-2 py-1 border border-slate-300">
                          {formatTrackingNumber(shipment.tracking_number).substring(0, 8)}...
                        </div>
                      </td>
                      <td className="p-2 sm:p-4 hidden md:table-cell">
                        <div>
                          <div className="font-medium text-slate-900 text-xs">{shipment.client_name}</div>
                          <div className="text-xs text-slate-500">{shipment.client_email}</div>
                        </div>
                      </td>
                      <td className="p-2 sm:p-4 hidden lg:table-cell">
                        <div>
                          <div className="font-medium text-slate-900 text-xs">{shipment.receiver_name || "N/A"}</div>
                          <div className="text-xs text-slate-500">{shipment.receiver_email || "N/A"}</div>
                        </div>
                      </td>
                      <td className="p-2 sm:p-4 hidden sm:table-cell">
                        <div className="text-xs">
                          <div className="font-medium text-slate-900">{shipment.package_name}</div>
                          <div className="text-slate-500">{shipment.package_weight} lbs</div>
                        </div>
                      </td>
                      <td className="p-2 sm:p-4">
                        <Badge className={`${getStatusColor(shipment.current_status)} text-xs`}>
                          {shipment.current_status.replace("_", " ").substring(0, 7)}
                        </Badge>
                      </td>
                      <td className="p-2 sm:p-4 hidden md:table-cell">
                        <div className="text-xs text-slate-500">
                          {new Date(shipment.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-2 sm:p-4">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/track/${shipment.tracking_number}`, "_blank")}
                            className="border border-slate-300 p-1 sm:p-2 text-xs"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Dialog
                            open={isUpdateDialogOpen && selectedShipment?.id === shipment.id}
                            onOpenChange={(open) => {
                              setIsUpdateDialogOpen(open)
                              if (!open) setSelectedShipment(null)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedShipment(shipment)
                                  setUpdateForm({ status: shipment.current_status, location: "", description: "" })
                                }}
                                className="border border-slate-300 p-1 sm:p-2 text-xs"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md sm:max-w-lg p-4 sm:p-6">
                              <DialogHeader>
                                <DialogTitle className="text-base sm:text-xl font-bold text-slate-900">
                                  Update Shipment Status
                                </DialogTitle>
                                <DialogDescription className="text-slate-600 text-sm">
                                  Update the status for tracking number: {shipment.tracking_number}
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleUpdateStatus} className="space-y-4">
                                <div>
                                  <Label htmlFor="status" className="text-slate-900 font-medium text-sm">
                                    Status
                                  </Label>
                                  <Select
                                    value={updateForm.status}
                                    onValueChange={(value) => setUpdateForm({ ...updateForm, status: value })}
                                  >
                                    <SelectTrigger className="mt-2 border border-slate-300 text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="on_hold">On Hold</SelectItem>
                                      <SelectItem value="in_transit">In Transit</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor="location" className="text-slate-900 font-medium text-sm">
                                    Location
                                  </Label>
                                  <Input
                                    id="location"
                                    value={updateForm.location}
                                    onChange={(e) => setUpdateForm({ ...updateForm, location: e.target.value })}
                                    placeholder="Current location"
                                    className="mt-2 border border-slate-300 text-sm"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="description" className="text-slate-900 font-medium text-sm">
                                    Description
                                  </Label>
                                  <Textarea
                                    id="description"
                                    value={updateForm.description}
                                    onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                                    placeholder="Status update description"
                                    className="mt-2 border border-slate-300 text-sm"
                                  />
                                </div>

                                <Button
                                  type="submit"
                                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Update Status
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredShipments.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <Package className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 text-sm sm:text-lg">No shipments found</p>
                  <p className="text-slate-400 text-xs sm:text-sm">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

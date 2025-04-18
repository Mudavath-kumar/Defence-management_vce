"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ArrowUpDown, MoreHorizontal, Plus, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getVehicles, deployVehicle, returnVehicle } from "@/app/actions/vehicle-actions"
import { useToast } from "@/components/ui/use-toast"

export default function VehicleInventory() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isCheckinOpen, setIsCheckinOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [vehicles, setVehicles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function loadVehicles() {
      setIsLoading(true)
      try {
        const result = await getVehicles()
        if (result.success) {
          setVehicles(result.data)
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to load vehicles",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load vehicles",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadVehicles()
  }, [toast])

  async function handleDeploy(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await deployVehicle(formData)
      if (result.success) {
        toast({
          title: "Vehicle Deployed",
          description: `Successfully deployed vehicle ${selectedVehicle}`,
        })
        setIsCheckoutOpen(false)

        // Refresh vehicles list
        const updatedVehicles = await getVehicles()
        if (updatedVehicles.success) {
          setVehicles(updatedVehicles.data)
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to deploy vehicle",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deploy vehicle",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleReturn(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await returnVehicle(formData)
      if (result.success) {
        toast({
          title: "Vehicle Returned",
          description: `Successfully returned vehicle ${selectedVehicle}`,
        })
        setIsCheckinOpen(false)

        // Refresh vehicles list
        const updatedVehicles = await getVehicles()
        if (updatedVehicles.success) {
          setVehicles(updatedVehicles.data)
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to return vehicle",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to return vehicle",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="shadow-md border-slate-200 dark:border-slate-700 overflow-hidden">
      <CardHeader className="flex flex-row items-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-b">
        <div>
          <CardTitle className="text-xl text-blue-800 dark:text-blue-400">Vehicle Inventory</CardTitle>
          <CardDescription>Manage base vehicles and deployment status</CardDescription>
        </div>
        <Button className="ml-auto bg-blue-600 hover:bg-blue-700" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="list" className="w-full">
          <div className="px-4 pt-4 bg-slate-50 dark:bg-slate-800/50">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-200 dark:bg-slate-700">
              <TabsTrigger value="list" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                List View
              </TabsTrigger>
              <TabsTrigger value="status" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Status Overview
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="list" className="m-0">
            <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search vehicles..."
                  className="pl-8 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button variant="outline" size="icon" className="border-slate-300 hover:border-slate-400">
                <Filter className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-auto border-slate-300 hover:border-slate-400">
                    Type <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>All</DropdownMenuItem>
                  <DropdownMenuItem>Transport</DropdownMenuItem>
                  <DropdownMenuItem>Armored</DropdownMenuItem>
                  <DropdownMenuItem>Cargo</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="rounded-md">
              <div className="grid grid-cols-12 gap-2 p-3 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <div className="col-span-2">ID</div>
                <div className="col-span-3">Name</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Location</div>
                <div className="col-span-1"></div>
              </div>
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-2 text-sm text-slate-500">Loading vehicle inventory...</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {vehicles.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-sm text-slate-500">No vehicles found. Add a vehicle to get started.</p>
                    </div>
                  ) : (
                    vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="grid grid-cols-12 gap-2 p-3 text-sm items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="col-span-2 font-medium text-blue-600">{vehicle.id}</div>
                        <div className="col-span-3">{vehicle.name}</div>
                        <div className="col-span-2">{vehicle.type}</div>
                        <div className="col-span-2">
                          <Badge
                            variant="outline"
                            className={
                              vehicle.status === "Available"
                                ? "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                                : vehicle.status === "Deployed"
                                  ? "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"
                                  : "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                            }
                          >
                            <span className="flex items-center">
                              {vehicle.status === "Available" ? (
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                              ) : vehicle.status === "Deployed" ? (
                                <AlertTriangle className="mr-1 h-3 w-3" />
                              ) : (
                                <AlertTriangle className="mr-1 h-3 w-3" />
                              )}
                              {vehicle.status}
                            </span>
                          </Badge>
                        </div>
                        <div className="col-span-2">{vehicle.location}</div>
                        <div className="col-span-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedVehicle(vehicle.id)
                                  if (vehicle.status === "Available") {
                                    setIsCheckoutOpen(true)
                                  } else if (vehicle.status === "Deployed") {
                                    setIsCheckinOpen(true)
                                  }
                                }}
                                className={
                                  vehicle.status === "Available"
                                    ? "text-blue-600 focus:text-blue-600 focus:bg-blue-50"
                                    : vehicle.status === "Deployed"
                                      ? "text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                                      : ""
                                }
                              >
                                {vehicle.status === "Available"
                                  ? "Deploy"
                                  : vehicle.status === "Deployed"
                                    ? "Return"
                                    : "View Details"}
                              </DropdownMenuItem>
                              <DropdownMenuItem>Maintenance Log</DropdownMenuItem>
                              <DropdownMenuItem>Fuel Log</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-red-50">
                                Mark as Out of Service
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="status" className="m-0 p-4 bg-slate-50 dark:bg-slate-800/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-blue-500 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {vehicles.filter((v) => v.status === "Available").length}
                  </div>
                  <p className="text-xs text-slate-500">Ready for deployment</p>
                  <div className="w-full h-1.5 bg-blue-100 rounded-full mt-3">
                    <div
                      className="h-1.5 bg-blue-500 rounded-full"
                      style={{
                        width: `${vehicles.length ? (vehicles.filter((v) => v.status === "Available").length / vehicles.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-amber-500 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-amber-700">Deployed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">
                    {vehicles.filter((v) => v.status === "Deployed").length}
                  </div>
                  <p className="text-xs text-slate-500">Currently in field operations</p>
                  <div className="w-full h-1.5 bg-amber-100 rounded-full mt-3">
                    <div
                      className="h-1.5 bg-amber-500 rounded-full"
                      style={{
                        width: `${vehicles.length ? (vehicles.filter((v) => v.status === "Deployed").length / vehicles.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-red-500 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Maintenance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {vehicles.filter((v) => v.status === "Maintenance").length}
                  </div>
                  <p className="text-xs text-slate-500">Undergoing repairs</p>
                  <div className="w-full h-1.5 bg-red-100 rounded-full mt-3">
                    <div
                      className="h-1.5 bg-red-500 rounded-full"
                      style={{
                        width: `${vehicles.length ? (vehicles.filter((v) => v.status === "Maintenance").length / vehicles.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between py-3 bg-slate-50 dark:bg-slate-800/50 border-t">
        <div className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `Showing ${vehicles.length} vehicles`}
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled className="border-slate-300">
            Previous
          </Button>
          <Button variant="outline" size="sm" className="border-slate-300 hover:border-slate-400">
            Next
          </Button>
        </div>
      </CardFooter>

      {/* Deploy Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-[500px] border-blue-200 shadow-lg">
          <DialogHeader className="bg-blue-50 dark:bg-blue-900/20 -mx-6 -mt-6 px-6 py-4 rounded-t-lg border-b border-blue-200 dark:border-blue-800">
            <DialogTitle className="text-blue-800 dark:text-blue-400">Vehicle Deployment</DialogTitle>
            <DialogDescription>Assign this vehicle for field operations.</DialogDescription>
          </DialogHeader>
          <form action={handleDeploy}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicleId" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Vehicle ID
                </Label>
                <Input
                  id="vehicleId"
                  name="vehicleId"
                  value={selectedVehicle || ""}
                  className="col-span-3 border-slate-300 bg-slate-50"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="commander" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Commander
                </Label>
                <Select name="commander" required>
                  <SelectTrigger className="col-span-3 border-slate-300">
                    <SelectValue placeholder="Select commander" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Capt. Reynolds">Capt. Reynolds</SelectItem>
                    <SelectItem value="Lt. Chen">Lt. Chen</SelectItem>
                    <SelectItem value="Sgt. Wilson">Sgt. Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mission" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Mission
                </Label>
                <Select name="mission" required>
                  <SelectTrigger className="col-span-3 border-slate-300">
                    <SelectValue placeholder="Select mission type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Patrol">Patrol</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Reconnaissance">Reconnaissance</SelectItem>
                    <SelectItem value="Supply Run">Supply Run</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Duration
                </Label>
                <Input
                  id="duration"
                  name="duration"
                  placeholder="Estimated duration"
                  className="col-span-3 border-slate-300"
                />
              </div>
            </div>
            <DialogFooter className="bg-slate-50 dark:bg-slate-800/50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg border-t">
              <Button
                variant="outline"
                onClick={() => setIsCheckoutOpen(false)}
                className="border-slate-300"
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Confirm Deployment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={isCheckinOpen} onOpenChange={setIsCheckinOpen}>
        <DialogContent className="sm:max-w-[500px] border-amber-200 shadow-lg">
          <DialogHeader className="bg-amber-50 dark:bg-amber-900/20 -mx-6 -mt-6 px-6 py-4 rounded-t-lg border-b border-amber-200 dark:border-amber-800">
            <DialogTitle className="text-amber-800 dark:text-amber-400">Vehicle Return</DialogTitle>
            <DialogDescription>Return this vehicle to the motor pool.</DialogDescription>
          </DialogHeader>
          <form action={handleReturn}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicleId" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Vehicle ID
                </Label>
                <Input
                  id="vehicleId"
                  name="vehicleId"
                  value={selectedVehicle || ""}
                  className="col-span-3 border-slate-300 bg-slate-50"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="condition" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Condition
                </Label>
                <Select name="condition" required>
                  <SelectTrigger className="col-span-3 border-slate-300">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor - Needs Maintenance">Poor - Needs Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fuel" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Fuel Level
                </Label>
                <Select name="fuel" required>
                  <SelectTrigger className="col-span-3 border-slate-300">
                    <SelectValue placeholder="Select fuel level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full">Full</SelectItem>
                    <SelectItem value="3/4">3/4</SelectItem>
                    <SelectItem value="1/2">1/2</SelectItem>
                    <SelectItem value="1/4">1/4</SelectItem>
                    <SelectItem value="Empty">Empty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="returnLocation" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Return Location
                </Label>
                <Select name="returnLocation" required>
                  <SelectTrigger className="col-span-3 border-slate-300">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Motor Pool A">Motor Pool A</SelectItem>
                    <SelectItem value="Motor Pool B">Motor Pool B</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="returnNotes" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Notes
                </Label>
                <Input
                  id="returnNotes"
                  name="returnNotes"
                  placeholder="Any issues or comments"
                  className="col-span-3 border-slate-300"
                />
              </div>
            </div>
            <DialogFooter className="bg-slate-50 dark:bg-slate-800/50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg border-t">
              <Button
                variant="outline"
                onClick={() => setIsCheckinOpen(false)}
                className="border-slate-300"
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Confirm Return"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

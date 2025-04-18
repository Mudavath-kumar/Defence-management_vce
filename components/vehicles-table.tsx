"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
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
import { getVehicles } from "@/app/actions/vehicle-actions"
import { useToast } from "@/components/ui/use-toast"

export default function VehiclesTable() {
  const [vehicles, setVehicles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState(null)
  const router = useRouter()
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

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "All" || vehicle.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return

    try {
      // Implement your delete logic here, e.g., API call
      console.log("Deleting vehicle:", vehicleToDelete.id)
      // After successful deletion:
      setVehicles(vehicles.filter((v) => v.id !== vehicleToDelete.id))
      toast({
        title: "Vehicle deleted",
        description: `${vehicleToDelete.name} has been deleted successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vehicle",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setVehicleToDelete(null)
    }
  }

  return (
    <Card className="shadow-md border-slate-200 dark:border-slate-700 overflow-hidden">
      <CardHeader className="flex flex-row items-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-b">
        <div>
          <CardTitle className="text-xl text-blue-800 dark:text-blue-400">Vehicle Inventory</CardTitle>
          <CardDescription>Manage vehicle deployments and maintenance</CardDescription>
        </div>
        <Link href="/vehicles/new" className="ml-auto">
          <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search vehicles..."
              className="pl-8 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="border-slate-300 hover:border-slate-400">
            <Filter className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto border-slate-300 hover:border-slate-400">
                Status: {statusFilter} <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("All")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Available")}>Available</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Deployed")}>Deployed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Maintenance")}>Maintenance</DropdownMenuItem>
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
            <div className="col-span-1">Actions</div>
          </div>
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-sm text-slate-500">Loading vehicle inventory...</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredVehicles.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500">No vehicles found. Add a vehicle to get started.</p>
                </div>
              ) : (
                filteredVehicles.map((vehicle) => (
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
                          <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push(`/vehicles/${vehicle.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/vehicles/${vehicle.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive focus:bg-red-50"
                            onClick={() => {
                              setVehicleToDelete(vehicle)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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
      </CardContent>
      <CardFooter className="flex justify-between py-3 bg-slate-50 dark:bg-slate-800/50 border-t">
        <div className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `Showing ${filteredVehicles.length} of ${vehicles.length} vehicles`}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {vehicleToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteVehicle}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

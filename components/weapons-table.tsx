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
import { getWeapons } from "@/app/actions/weapon-actions"
import { useToast } from "@/components/ui/use-toast"

export default function WeaponsTable() {
  const [weapons, setWeapons] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [weaponToDelete, setWeaponToDelete] = useState(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadWeapons() {
      setIsLoading(true)
      try {
        const result = await getWeapons()
        if (result.success) {
          setWeapons(result.data)
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to load weapons",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load weapons",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadWeapons()
  }, [toast])

  const filteredWeapons = weapons.filter((weapon) => {
    const matchesSearch =
      weapon.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      weapon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      weapon.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "All" || weapon.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleDeleteWeapon = async () => {
    if (!weaponToDelete) return

    try {
      // Implement your delete logic here, e.g., API call
      console.log("Deleting weapon:", weaponToDelete.id)
      // After successful deletion:
      setWeapons(weapons.filter((w) => w.id !== weaponToDelete.id))
      toast({
        title: "Weapon deleted",
        description: `${weaponToDelete.name} has been deleted successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete weapon",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setWeaponToDelete(null)
    }
  }

  return (
    <Card className="shadow-md border-slate-200 dark:border-slate-700 overflow-hidden">
      <CardHeader className="flex flex-row items-center bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-b">
        <div>
          <CardTitle className="text-xl text-emerald-800 dark:text-emerald-400">Weapons Inventory</CardTitle>
          <CardDescription>Manage weapons check-in and check-out</CardDescription>
        </div>
        <Link href="/weapons/new" className="ml-auto">
          <Button className="bg-emerald-600 hover:bg-emerald-700" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Weapon
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search weapons..."
              className="pl-8 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
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
              <DropdownMenuItem onClick={() => setStatusFilter("Checked Out")}>Checked Out</DropdownMenuItem>
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
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-sm text-slate-500">Loading weapons inventory...</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredWeapons.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500">No weapons found. Add a weapon to get started.</p>
                </div>
              ) : (
                filteredWeapons.map((weapon) => (
                  <div
                    key={weapon.id}
                    className="grid grid-cols-12 gap-2 p-3 text-sm items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="col-span-2 font-medium text-emerald-600">{weapon.id}</div>
                    <div className="col-span-3">{weapon.name}</div>
                    <div className="col-span-2">{weapon.type}</div>
                    <div className="col-span-2">
                      <Badge
                        variant="outline"
                        className={
                          weapon.status === "Available"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200"
                            : weapon.status === "Checked Out"
                              ? "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"
                              : "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                        }
                      >
                        <span className="flex items-center">
                          {weapon.status === "Available" ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : weapon.status === "Checked Out" ? (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          ) : (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          )}
                          {weapon.status}
                        </span>
                      </Badge>
                    </div>
                    <div className="col-span-2">{weapon.location}</div>
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
                          <DropdownMenuItem onClick={() => router.push(`/weapons/${weapon.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/weapons/${weapon.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive focus:bg-red-50"
                            onClick={() => {
                              setWeaponToDelete(weapon)
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
          {isLoading ? "Loading..." : `Showing ${filteredWeapons.length} of ${weapons.length} weapons`}
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
              Are you sure you want to delete {weaponToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteWeapon}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

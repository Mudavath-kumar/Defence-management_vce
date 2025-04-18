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
import { getPersonnel, deletePersonnel } from "@/app/actions/personnel-actions"
import { useToast } from "@/components/ui/use-toast"

export default function PersonnelTable() {
  const [personnel, setPersonnel] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [personnelToDelete, setPersonnelToDelete] = useState(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadPersonnel() {
      setIsLoading(true)
      try {
        const result = await getPersonnel()
        if (result.success) {
          setPersonnel(result.data)
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to load personnel",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load personnel",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPersonnel()
  }, [toast])

  const filteredPersonnel = personnel.filter((person) => {
    const matchesSearch =
      person.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.rank?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (person.specialization && person.specialization.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "All" || person.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleDeletePersonnel = async () => {
    if (!personnelToDelete) return

    try {
      const result = await deletePersonnel(personnelToDelete.id)
      if (result.success) {
        setPersonnel(personnel.filter((p) => p.id !== personnelToDelete.id))
        toast({
          title: "Personnel deleted",
          description: `${personnelToDelete.name} has been deleted successfully`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete personnel",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete personnel",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setPersonnelToDelete(null)
    }
  }

  return (
    <Card className="shadow-md border-slate-200 dark:border-slate-700 overflow-hidden">
      <CardHeader className="flex flex-row items-center bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-b">
        <div>
          <CardTitle className="text-xl text-purple-800 dark:text-purple-400">Personnel Directory</CardTitle>
          <CardDescription>Manage military personnel and assignments</CardDescription>
        </div>
        <Link href="/personnel/new" className="ml-auto">
          <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Personnel
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search personnel..."
              className="pl-8 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
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
              <DropdownMenuItem onClick={() => setStatusFilter("Active")}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Deployed")}>Deployed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("On Leave")}>On Leave</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Medical")}>Medical</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Inactive")}>Inactive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md">
          <div className="grid grid-cols-12 gap-2 p-3 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <div className="col-span-2">ID</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Rank</div>
            <div className="col-span-2">Unit</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Actions</div>
          </div>
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-sm text-slate-500">Loading personnel directory...</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredPersonnel.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500">No personnel found. Add personnel to get started.</p>
                </div>
              ) : (
                filteredPersonnel.map((person) => (
                  <div
                    key={person.id}
                    className="grid grid-cols-12 gap-2 p-3 text-sm items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="col-span-2 font-medium text-purple-600">{person.id}</div>
                    <div className="col-span-3">{person.name}</div>
                    <div className="col-span-2">{person.rank}</div>
                    <div className="col-span-2">{person.unit}</div>
                    <div className="col-span-2">
                      <Badge
                        variant="outline"
                        className={
                          person.status === "Active"
                            ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                            : person.status === "Deployed"
                              ? "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                              : person.status === "On Leave"
                                ? "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"
                                : person.status === "Medical"
                                  ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }
                      >
                        <span className="flex items-center">
                          {person.status === "Active" ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          )}
                          {person.status}
                        </span>
                      </Badge>
                    </div>
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
                          <DropdownMenuItem onClick={() => router.push(`/personnel/${person.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/personnel/${person.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive focus:bg-red-50"
                            onClick={() => {
                              setPersonnelToDelete(person)
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
          {isLoading ? "Loading..." : `Showing ${filteredPersonnel.length} of ${personnel.length} personnel`}
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
              Are you sure you want to delete {personnelToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePersonnel}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

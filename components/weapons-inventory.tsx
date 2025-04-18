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
import { getWeapons, checkoutWeapon, checkinWeapon } from "@/app/actions/weapon-actions"
import { useToast } from "@/components/ui/use-toast"

export default function WeaponsInventory() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isCheckinOpen, setIsCheckinOpen] = useState(false)
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null)
  const [weapons, setWeapons] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  async function handleCheckout(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await checkoutWeapon(formData)
      if (result.success) {
        toast({
          title: "Weapon Checked Out",
          description: `Successfully checked out weapon ${selectedWeapon}`,
        })
        setIsCheckoutOpen(false)

        // Refresh weapons list
        const updatedWeapons = await getWeapons()
        if (updatedWeapons.success) {
          setWeapons(updatedWeapons.data)
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to check out weapon",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check out weapon",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCheckin(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await checkinWeapon(formData)
      if (result.success) {
        toast({
          title: "Weapon Checked In",
          description: `Successfully checked in weapon ${selectedWeapon}`,
        })
        setIsCheckinOpen(false)

        // Refresh weapons list
        const updatedWeapons = await getWeapons()
        if (updatedWeapons.success) {
          setWeapons(updatedWeapons.data)
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to check in weapon",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check in weapon",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="shadow-md border-slate-200 dark:border-slate-700 overflow-hidden">
      <CardHeader className="flex flex-row items-center bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-b">
        <div>
          <CardTitle className="text-xl text-emerald-800 dark:text-emerald-400">Weapons Inventory</CardTitle>
          <CardDescription>Manage weapons check-in and check-out</CardDescription>
        </div>
        <Button className="ml-auto bg-emerald-600 hover:bg-emerald-700" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Weapon
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search weapons..."
              className="pl-8 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <Button variant="outline" size="icon" className="border-slate-300 hover:border-slate-400">
            <Filter className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto border-slate-300 hover:border-slate-400">
                Status <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Available</DropdownMenuItem>
              <DropdownMenuItem>Checked Out</DropdownMenuItem>
              <DropdownMenuItem>Maintenance</DropdownMenuItem>
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
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-sm text-slate-500">Loading weapons inventory...</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {weapons.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500">No weapons found. Add a weapon to get started.</p>
                </div>
              ) : (
                weapons.map((weapon) => (
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedWeapon(weapon.id)
                              if (weapon.status === "Available") {
                                setIsCheckoutOpen(true)
                              } else if (weapon.status === "Checked Out") {
                                setIsCheckinOpen(true)
                              }
                            }}
                            className={
                              weapon.status === "Available"
                                ? "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50"
                                : weapon.status === "Checked Out"
                                  ? "text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                                  : ""
                            }
                          >
                            {weapon.status === "Available"
                              ? "Check Out"
                              : weapon.status === "Checked Out"
                                ? "Check In"
                                : "View Details"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem>Maintenance Log</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-red-50">
                            Mark as Decommissioned
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
          {isLoading ? "Loading..." : `Showing ${weapons.length} weapons`}
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

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-[500px] border-emerald-200 shadow-lg">
          <DialogHeader className="bg-emerald-50 dark:bg-emerald-900/20 -mx-6 -mt-6 px-6 py-4 rounded-t-lg border-b border-emerald-200 dark:border-emerald-800">
            <DialogTitle className="text-emerald-800 dark:text-emerald-400">Weapon Check-Out</DialogTitle>
            <DialogDescription>Assign this weapon to personnel for deployment or training.</DialogDescription>
          </DialogHeader>
          <form action={handleCheckout}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weaponId" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Weapon ID
                </Label>
                <Input
                  id="weaponId"
                  name="weaponId"
                  value={selectedWeapon || ""}
                  className="col-span-3 border-slate-300 bg-slate-50"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="personnel" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Personnel
                </Label>
                <Select name="personnel" required>
                  <SelectTrigger className="col-span-3 border-slate-300">
                    <SelectValue placeholder="Select personnel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lt. Johnson">Lt. Johnson</SelectItem>
                    <SelectItem value="Sgt. Martinez">Sgt. Martinez</SelectItem>
                    <SelectItem value="Cpl. Davis">Cpl. Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="purpose" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Purpose
                </Label>
                <Select name="purpose" required>
                  <SelectTrigger className="col-span-3 border-slate-300">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Patrol">Patrol</SelectItem>
                    <SelectItem value="Mission">Mission</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Notes
                </Label>
                <Input
                  id="notes"
                  name="notes"
                  placeholder="Additional information"
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
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Confirm Check-Out"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Check-in Dialog */}
      <Dialog open={isCheckinOpen} onOpenChange={setIsCheckinOpen}>
        <DialogContent className="sm:max-w-[500px] border-amber-200 shadow-lg">
          <DialogHeader className="bg-amber-50 dark:bg-amber-900/20 -mx-6 -mt-6 px-6 py-4 rounded-t-lg border-b border-amber-200 dark:border-amber-800">
            <DialogTitle className="text-amber-800 dark:text-amber-400">Weapon Check-In</DialogTitle>
            <DialogDescription>Return this weapon to inventory.</DialogDescription>
          </DialogHeader>
          <form action={handleCheckin}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weaponId" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Weapon ID
                </Label>
                <Input
                  id="weaponId"
                  name="weaponId"
                  value={selectedWeapon || ""}
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
                <Label htmlFor="location" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Return Location
                </Label>
                <Select name="location" required>
                  <SelectTrigger className="col-span-3 border-slate-300">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Armory A">Armory A</SelectItem>
                    <SelectItem value="Armory B">Armory B</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right font-medium text-slate-700 dark:text-slate-300">
                  Notes
                </Label>
                <Input
                  id="notes"
                  name="notes"
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
                {isSubmitting ? "Processing..." : "Confirm Check-In"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

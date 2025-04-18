import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import VehicleInventory from "@/components/vehicle-inventory"

export const metadata: Metadata = {
  title: "Vehicle Management | Defence Management System",
  description: "Manage vehicle inventory",
}

export default function VehiclesPage() {
  return (
    <div className="flex flex-col">
      <div className="relative w-full bg-gradient-to-r from-blue-800 to-slate-800 py-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-slate-900/70"></div>
        <div className="relative container py-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-white mb-2">Vehicle Management</h1>
            <p className="text-slate-200 mb-4">Track and manage all vehicles in the base fleet</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-950"></div>
      </div>

      <div className="container py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Vehicle Fleet</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-slate-300 hover:border-slate-400">
              Export Data
            </Button>
            <Link href="/vehicles/new">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add New Vehicle
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          <VehicleInventory />
        </div>
      </div>
    </div>
  )
}

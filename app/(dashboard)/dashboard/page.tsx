import type { Metadata } from "next"
import DashboardStats from "@/components/dashboard-stats"
import WeaponsInventory from "@/components/weapons-inventory"
import VehicleInventory from "@/components/vehicle-inventory"
import RecentActivities from "@/components/recent-activities"
import DashboardCharts from "@/components/dashboard-charts"
import { UserCircle, BellIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Dashboard | Defence Management System",
  description: "Defence Management System Dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <div className="relative w-full bg-gradient-to-r from-emerald-800 to-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-slate-900/70"></div>
        <div className="relative container py-16">
          <div className="flex justify-between items-start">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-emerald-500 hover:bg-emerald-600">SECURE SYSTEM</Badge>
              <h1 className="text-4xl font-bold text-white mb-4">Defence Management System</h1>
              <p className="text-slate-200 mb-6 text-lg">
                Comprehensive tracking and management of military assets, personnel, and operations.
              </p>
              <div className="flex gap-3">
                <Button className="bg-white text-emerald-800 hover:bg-slate-100">View Active Operations</Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/10">
                  Security Status
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full bg-white/10 text-white hover:bg-white/20">
                <BellIcon className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold">
                  3
                </span>
              </Button>
              <div className="flex items-center gap-3 bg-white/10 p-2 px-4 rounded-full">
                <UserCircle className="h-8 w-8 text-white" />
                <div>
                  <p className="text-white font-medium text-sm">Col. James Wilson</p>
                  <p className="text-slate-300 text-xs">Base Commander</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-950"></div>
        </div>
      </div>

      <div className="container py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Base Command Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-slate-300 hover:border-slate-400">
              Generate Report
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              New Operation
            </Button>
          </div>
        </div>

        <DashboardStats />

        <DashboardCharts />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <WeaponsInventory />
            <RecentActivities />
          </div>
          <div className="space-y-6">
            <VehicleInventory />
          </div>
        </div>
      </div>
    </div>
  )
}

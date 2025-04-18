import type React from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <SidebarNav />
      <div className="flex-1 flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}

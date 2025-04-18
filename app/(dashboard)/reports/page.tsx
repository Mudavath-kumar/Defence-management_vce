import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"
import ReportsTable from "@/components/reports-table"

export const metadata: Metadata = {
  title: "Reports | Defence Management System",
  description: "Generate and view reports",
}

export default function ReportsPage() {
  return (
    <div className="flex flex-col">
      <div className="relative w-full bg-gradient-to-r from-slate-800 to-slate-700 py-12">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/70"></div>
        <div className="relative container py-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
            <p className="text-slate-200 mb-4">Generate and view reports for all base operations</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-950"></div>
      </div>

      <div className="container py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Available Reports</h2>
          <Button size="sm" className="bg-slate-600 hover:bg-slate-700">
            <FileText className="mr-2 h-4 w-4" />
            Generate Custom Report
          </Button>
        </div>

        <div className="grid gap-6">
          <ReportsTable />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <Card className="shadow-md border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>Weapons Inventory Report</CardTitle>
              <CardDescription>Summary of all weapons and their status</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Last generated: 2 days ago</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>Vehicle Status Report</CardTitle>
              <CardDescription>Overview of vehicle fleet and deployments</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Last generated: 1 day ago</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>Personnel Deployment Report</CardTitle>
              <CardDescription>Status of all personnel and assignments</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Last generated: 3 days ago</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

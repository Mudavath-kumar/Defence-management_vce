"use client"

import { useState } from "react"
import { FileText, Download, Calendar, Filter, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for reports
const mockReports = [
  {
    id: "R1001",
    title: "Weapons Inventory Report",
    type: "Inventory",
    date: "2023-12-15",
    status: "Completed",
    author: "Lt. Johnson",
  },
  {
    id: "R1002",
    title: "Vehicle Status Report",
    type: "Status",
    date: "2023-12-14",
    status: "Completed",
    author: "Capt. Reynolds",
  },
  {
    id: "R1003",
    title: "Personnel Deployment Report",
    type: "Deployment",
    date: "2023-12-13",
    status: "Completed",
    author: "Col. Wilson",
  },
  {
    id: "R1004",
    title: "Maintenance Schedule",
    type: "Maintenance",
    date: "2023-12-16",
    status: "Pending",
    author: "Sgt. Martinez",
  },
  {
    id: "R1005",
    title: "Quarterly Operations Summary",
    type: "Operations",
    date: "2023-12-10",
    status: "Completed",
    author: "Maj. Davis",
  },
]

export default function ReportsTable() {
  const [reports, setReports] = useState(mockReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.author.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "All" || report.type === typeFilter

    return matchesSearch && matchesType
  })

  return (
    <Card className="shadow-md border-slate-200 dark:border-slate-700 overflow-hidden">
      <CardHeader className="flex flex-row items-center bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 border-b">
        <div>
          <CardTitle className="text-xl text-slate-800 dark:text-slate-400">Reports Library</CardTitle>
          <CardDescription>Access and download system reports</CardDescription>
        </div>
        <Button className="ml-auto bg-slate-600 hover:bg-slate-700" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Generate New Report
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reports..."
              className="pl-8 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="border-slate-300 hover:border-slate-400">
            <Filter className="h-4 w-4" />
          </Button>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] border-slate-300">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Inventory">Inventory</SelectItem>
              <SelectItem value="Status">Status</SelectItem>
              <SelectItem value="Deployment">Deployment</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md">
          <div className="grid grid-cols-12 gap-2 p-3 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <div className="col-span-2">ID</div>
            <div className="col-span-4">Title</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Actions</div>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredReports.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">No reports found matching your criteria.</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="grid grid-cols-12 gap-2 p-3 text-sm items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="col-span-2 font-medium text-slate-600">{report.id}</div>
                  <div className="col-span-4">
                    <div className="font-medium">{report.title}</div>
                    <div className="text-xs text-muted-foreground">By {report.author}</div>
                  </div>
                  <div className="col-span-2">
                    <Badge
                      variant="outline"
                      className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                    >
                      {report.type}
                    </Badge>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <span>{new Date(report.date).toLocaleDateString()}</span>
                  </div>
                  <div className="col-span-2">
                    <Button variant="outline" size="sm" className="gap-1 border-slate-300">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between py-3 bg-slate-50 dark:bg-slate-800/50 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {filteredReports.length} of {reports.length} reports
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
    </Card>
  )
}

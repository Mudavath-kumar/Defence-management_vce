import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Personnel from "@/models/Personnel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, CheckCircle2, AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "Personnel Details | Defence Management System",
  description: "View personnel details",
}

async function getPersonnel(id: string) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  await connectToDatabase()

  const personnel = await Personnel.findOne({ id })

  if (!personnel) {
    return null
  }

  return JSON.parse(JSON.stringify(personnel))
}

export default async function PersonnelDetailPage({ params }: { params: { id: string } }) {
  const personnel = await getPersonnel(params.id)

  if (!personnel) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/personnel">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Personnel Details</h1>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href={`/personnel/${params.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Personnel
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">{personnel.name}</CardTitle>
            <CardDescription>ID: {personnel.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Rank</h3>
                <p>{personnel.rank}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Unit</h3>
                <p>{personnel.unit}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <Badge
                  variant="outline"
                  className={
                    personnel.status === "Active"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : personnel.status === "Deployed"
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : personnel.status === "On Leave"
                          ? "bg-amber-100 text-amber-700 border-amber-200"
                          : personnel.status === "Medical"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                  }
                >
                  <span className="flex items-center">
                    {personnel.status === "Active" ? (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    ) : (
                      <AlertTriangle className="mr-1 h-3 w-3" />
                    )}
                    {personnel.status}
                  </span>
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Specialization</h3>
                <p>{personnel.specialization || "N/A"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h3>
              <p className="text-sm">{personnel.contactInfo || "No contact information available"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
              <p className="text-sm">{personnel.notes || "No notes available"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
              <p className="text-sm">{new Date(personnel.lastUpdated).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No assignment records found.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipment Issued</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No equipment records found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

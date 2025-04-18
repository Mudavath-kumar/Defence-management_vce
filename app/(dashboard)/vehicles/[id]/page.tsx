import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Vehicle from "@/models/Vehicle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, CheckCircle2, AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "Vehicle Details | Defence Management System",
  description: "View vehicle details",
}

async function getVehicle(id: string) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  await connectToDatabase()

  const vehicle = await Vehicle.findOne({ id })

  if (!vehicle) {
    return null
  }

  return JSON.parse(JSON.stringify(vehicle))
}

export default async function VehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = await getVehicle(params.id)

  if (!vehicle) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/vehicles">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Vehicle Details</h1>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href={`/vehicles/${params.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Vehicle
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">{vehicle.name}</CardTitle>
            <CardDescription>ID: {vehicle.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                <p>{vehicle.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <Badge
                  variant="outline"
                  className={
                    vehicle.status === "Available"
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : vehicle.status === "Deployed"
                        ? "bg-amber-100 text-amber-700 border-amber-200"
                        : "bg-red-100 text-red-700 border-red-200"
                  }
                >
                  <span className="flex items-center">
                    {vehicle.status === "Available" ? (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    ) : (
                      <AlertTriangle className="mr-1 h-3 w-3" />
                    )}
                    {vehicle.status}
                  </span>
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p>{vehicle.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Condition</h3>
                <p>{vehicle.condition}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Fuel Level</h3>
                <p>{vehicle.fuelLevel}</p>
              </div>
              {vehicle.assignedTo && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Assigned To</h3>
                  <p>{vehicle.assignedTo}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
              <p className="text-sm">{vehicle.notes || "No notes available"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
              <p className="text-sm">{new Date(vehicle.lastUpdated).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No maintenance records found.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deployment History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No deployment records found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

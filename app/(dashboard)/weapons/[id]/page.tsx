import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Weapon from "@/models/Weapon"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, CheckCircle2, AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "Weapon Details | Defence Management System",
  description: "View weapon details",
}

async function getWeapon(id: string) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  await connectToDatabase()

  const weapon = await Weapon.findOne({ id })

  if (!weapon) {
    return null
  }

  return JSON.parse(JSON.stringify(weapon))
}

export default async function WeaponDetailPage({ params }: { params: { id: string } }) {
  const weapon = await getWeapon(params.id)

  if (!weapon) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/weapons">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Weapon Details</h1>
        </div>
        <Button asChild>
          <Link href={`/weapons/${params.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Weapon
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">{weapon.name}</CardTitle>
            <CardDescription>ID: {weapon.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                <p>{weapon.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <Badge
                  variant="outline"
                  className={
                    weapon.status === "Available"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : weapon.status === "Checked Out"
                        ? "bg-amber-100 text-amber-700 border-amber-200"
                        : "bg-red-100 text-red-700 border-red-200"
                  }
                >
                  <span className="flex items-center">
                    {weapon.status === "Available" ? (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    ) : (
                      <AlertTriangle className="mr-1 h-3 w-3" />
                    )}
                    {weapon.status}
                  </span>
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p>{weapon.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Condition</h3>
                <p>{weapon.condition}</p>
              </div>
              {weapon.assignedTo && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Assigned To</h3>
                  <p>{weapon.assignedTo}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
              <p className="text-sm">{weapon.notes || "No notes available"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
              <p className="text-sm">{new Date(weapon.lastUpdated).toLocaleString()}</p>
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
              <CardTitle>Check-out History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No check-out records found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

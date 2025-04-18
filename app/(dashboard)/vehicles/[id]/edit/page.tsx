import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Vehicle from "@/models/Vehicle"
import VehicleForm from "@/components/vehicle-form"

export const metadata: Metadata = {
  title: "Edit Vehicle | Defence Management System",
  description: "Edit vehicle details",
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

export default async function EditVehiclePage({ params }: { params: { id: string } }) {
  const vehicle = await getVehicle(params.id)

  if (!vehicle) {
    notFound()
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Vehicle</h1>
      <VehicleForm initialData={vehicle} isEditing />
    </div>
  )
}

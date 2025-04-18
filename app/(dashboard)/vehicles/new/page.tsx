import type { Metadata } from "next"
import VehicleForm from "@/components/vehicle-form"

export const metadata: Metadata = {
  title: "Add New Vehicle | Defence Management System",
  description: "Add a new vehicle to the inventory",
}

export default function NewVehiclePage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Vehicle</h1>
      <VehicleForm />
    </div>
  )
}

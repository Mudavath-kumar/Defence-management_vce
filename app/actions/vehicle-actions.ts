"use server"

import connectToDatabase from "@/lib/mongodb"
import Vehicle from "@/models/Vehicle"
import Activity from "@/models/Activity"
import { revalidatePath } from "next/cache"

export async function getVehicles() {
  try {
    await connectToDatabase()
    const vehicles = await Vehicle.find({}).sort({ lastUpdated: -1 })
    return { success: true, data: JSON.parse(JSON.stringify(vehicles)) }
  } catch (error) {
    console.error("Failed to fetch vehicles:", error)
    return { success: false, error: "Failed to fetch vehicles" }
  }
}

export async function deployVehicle(formData: FormData) {
  try {
    await connectToDatabase()

    const vehicleId = formData.get("vehicleId") as string
    const commander = formData.get("commander") as string
    const mission = formData.get("mission") as string
    const duration = formData.get("duration") as string

    // Update vehicle status
    const vehicle = await Vehicle.findOneAndUpdate(
      { id: vehicleId },
      {
        status: "Deployed",
        assignedTo: commander,
        notes: `Mission: ${mission}, Duration: ${duration}`,
        lastUpdated: new Date(),
      },
      { new: true },
    )

    if (!vehicle) {
      return { success: false, error: "Vehicle not found" }
    }

    // Log activity
    await Activity.create({
      type: "vehicle-deploy",
      user: commander,
      userInitials: commander
        .split(" ")
        .map((n) => n[0])
        .join(""),
      item: `${vehicle.name} (${vehicle.id})`,
      notes: `Mission: ${mission}, Duration: ${duration}`,
    })

    revalidatePath("/")
    revalidatePath("/vehicles")

    return { success: true, data: JSON.parse(JSON.stringify(vehicle)) }
  } catch (error) {
    console.error("Failed to deploy vehicle:", error)
    return { success: false, error: "Failed to deploy vehicle" }
  }
}

export async function returnVehicle(formData: FormData) {
  try {
    await connectToDatabase()

    const vehicleId = formData.get("vehicleId") as string
    const condition = formData.get("condition") as string
    const fuelLevel = formData.get("fuel") as string
    const location = formData.get("returnLocation") as string
    const notes = formData.get("returnNotes") as string

    // Get current vehicle to get assignedTo before updating
    const currentVehicle = await Vehicle.findOne({ id: vehicleId })
    if (!currentVehicle) {
      return { success: false, error: "Vehicle not found" }
    }

    const assignedTo = currentVehicle.assignedTo

    // Update vehicle status
    const vehicle = await Vehicle.findOneAndUpdate(
      { id: vehicleId },
      {
        status: condition === "Poor - Needs Maintenance" ? "Maintenance" : "Available",
        location: location,
        assignedTo: undefined,
        condition: condition,
        fuelLevel: fuelLevel,
        notes: notes,
        lastUpdated: new Date(),
      },
      { new: true },
    )

    // Log activity
    await Activity.create({
      type: "vehicle-return",
      user: assignedTo || "Unknown",
      userInitials: assignedTo
        ? assignedTo
            .split(" ")
            .map((n) => n[0])
            .join("")
        : "UN",
      item: `${vehicle.name} (${vehicle.id})`,
      notes: `Condition: ${condition}, Fuel: ${fuelLevel}. ${notes}`,
    })

    revalidatePath("/")
    revalidatePath("/vehicles")

    return { success: true, data: JSON.parse(JSON.stringify(vehicle)) }
  } catch (error) {
    console.error("Failed to return vehicle:", error)
    return { success: false, error: "Failed to return vehicle" }
  }
}

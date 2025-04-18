import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Vehicle from "@/models/Vehicle"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const vehicles = await Vehicle.find({}).sort({ lastUpdated: -1 })

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json({ message: "An error occurred while fetching vehicles" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Validate required fields
    if (!data.id || !data.name || !data.type || !data.status || !data.location) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if vehicle with this ID already exists
    const existingVehicle = await Vehicle.findOne({ id: data.id })
    if (existingVehicle) {
      return NextResponse.json({ message: "Vehicle with this ID already exists" }, { status: 409 })
    }

    // Create new vehicle
    const vehicle = new Vehicle({
      id: data.id,
      name: data.name,
      type: data.type,
      status: data.status,
      location: data.location,
      condition: data.condition,
      fuelLevel: data.fuelLevel,
      notes: data.notes,
      lastUpdated: new Date(),
    })

    await vehicle.save()

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error("Error creating vehicle:", error)
    return NextResponse.json({ message: "An error occurred while creating the vehicle" }, { status: 500 })
  }
}

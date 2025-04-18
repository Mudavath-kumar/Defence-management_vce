import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Personnel from "@/models/Personnel"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const personnel = await Personnel.find({}).sort({ lastUpdated: -1 })

    return NextResponse.json(personnel)
  } catch (error) {
    console.error("Error fetching personnel:", error)
    return NextResponse.json({ message: "An error occurred while fetching personnel" }, { status: 500 })
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
    if (!data.id || !data.name || !data.rank || !data.unit || !data.status) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if personnel with this ID already exists
    const existingPersonnel = await Personnel.findOne({ id: data.id })
    if (existingPersonnel) {
      return NextResponse.json({ message: "Personnel with this ID already exists" }, { status: 409 })
    }

    // Create new personnel
    const personnel = new Personnel({
      id: data.id,
      name: data.name,
      rank: data.rank,
      unit: data.unit,
      status: data.status,
      specialization: data.specialization,
      contactInfo: data.contactInfo,
      notes: data.notes,
      lastUpdated: new Date(),
    })

    await personnel.save()

    return NextResponse.json(personnel, { status: 201 })
  } catch (error) {
    console.error("Error creating personnel:", error)
    return NextResponse.json({ message: "An error occurred while creating the personnel" }, { status: 500 })
  }
}

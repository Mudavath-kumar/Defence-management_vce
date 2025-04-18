import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Personnel from "@/models/Personnel"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    await connectToDatabase()

    const personnel = await Personnel.findOne({ id })

    if (!personnel) {
      return NextResponse.json({ message: "Personnel not found" }, { status: 404 })
    }

    return NextResponse.json(personnel)
  } catch (error) {
    console.error("Error fetching personnel:", error)
    return NextResponse.json({ message: "An error occurred while fetching the personnel" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const data = await req.json()

    // Validate required fields
    if (!data.name || !data.rank || !data.unit || !data.status) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    const personnel = await Personnel.findOneAndUpdate(
      { id },
      {
        name: data.name,
        rank: data.rank,
        unit: data.unit,
        status: data.status,
        specialization: data.specialization,
        contactInfo: data.contactInfo,
        notes: data.notes,
        lastUpdated: new Date(),
      },
      { new: true },
    )

    if (!personnel) {
      return NextResponse.json({ message: "Personnel not found" }, { status: 404 })
    }

    return NextResponse.json(personnel)
  } catch (error) {
    console.error("Error updating personnel:", error)
    return NextResponse.json({ message: "An error occurred while updating the personnel" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    await connectToDatabase()

    const personnel = await Personnel.findOneAndDelete({ id })

    if (!personnel) {
      return NextResponse.json({ message: "Personnel not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Personnel deleted successfully" })
  } catch (error) {
    console.error("Error deleting personnel:", error)
    return NextResponse.json({ message: "An error occurred while deleting the personnel" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Weapon from "@/models/Weapon"
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

    const weapon = await Weapon.findOne({ id })

    if (!weapon) {
      return NextResponse.json({ message: "Weapon not found" }, { status: 404 })
    }

    return NextResponse.json(weapon)
  } catch (error) {
    console.error("Error fetching weapon:", error)
    return NextResponse.json({ message: "An error occurred while fetching the weapon" }, { status: 500 })
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
    if (!data.name || !data.type || !data.status || !data.location) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    const weapon = await Weapon.findOneAndUpdate(
      { id },
      {
        name: data.name,
        type: data.type,
        status: data.status,
        location: data.location,
        condition: data.condition,
        notes: data.notes,
        lastUpdated: new Date(),
      },
      { new: true },
    )

    if (!weapon) {
      return NextResponse.json({ message: "Weapon not found" }, { status: 404 })
    }

    return NextResponse.json(weapon)
  } catch (error) {
    console.error("Error updating weapon:", error)
    return NextResponse.json({ message: "An error occurred while updating the weapon" }, { status: 500 })
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

    const weapon = await Weapon.findOneAndDelete({ id })

    if (!weapon) {
      return NextResponse.json({ message: "Weapon not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Weapon deleted successfully" })
  } catch (error) {
    console.error("Error deleting weapon:", error)
    return NextResponse.json({ message: "An error occurred while deleting the weapon" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Weapon from "@/models/Weapon"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const weapons = await Weapon.find({}).sort({ lastUpdated: -1 })

    return NextResponse.json(weapons)
  } catch (error) {
    console.error("Error fetching weapons:", error)
    return NextResponse.json({ message: "An error occurred while fetching weapons" }, { status: 500 })
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

    // Check if weapon with this ID already exists
    const existingWeapon = await Weapon.findOne({ id: data.id })
    if (existingWeapon) {
      return NextResponse.json({ message: "Weapon with this ID already exists" }, { status: 409 })
    }

    // Create new weapon
    const weapon = new Weapon({
      id: data.id,
      name: data.name,
      type: data.type,
      status: data.status,
      location: data.location,
      condition: data.condition,
      notes: data.notes,
      lastUpdated: new Date(),
    })

    await weapon.save()

    return NextResponse.json(weapon, { status: 201 })
  } catch (error) {
    console.error("Error creating weapon:", error)
    return NextResponse.json({ message: "An error occurred while creating the weapon" }, { status: 500 })
  }
}

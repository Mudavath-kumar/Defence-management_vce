"use server"

import connectToDatabase from "@/lib/mongodb"
import Personnel from "@/models/Personnel"
import Activity from "@/models/Activity"
import { revalidatePath } from "next/cache"

export async function getPersonnel() {
  try {
    await connectToDatabase()
    const personnel = await Personnel.find({}).sort({ lastUpdated: -1 })
    return { success: true, data: JSON.parse(JSON.stringify(personnel)) }
  } catch (error) {
    console.error("Failed to fetch personnel:", error)
    return { success: false, error: "Failed to fetch personnel" }
  }
}

export async function assignPersonnel(formData: FormData) {
  try {
    await connectToDatabase()

    const personnelId = formData.get("personnelId") as string
    const assignment = formData.get("assignment") as string
    const location = formData.get("location") as string
    const notes = formData.get("notes") as string

    // Update personnel status
    const personnel = await Personnel.findOneAndUpdate(
      { id: personnelId },
      {
        status: "Deployed",
        unit: assignment,
        notes: notes,
        lastUpdated: new Date(),
      },
      { new: true },
    )

    if (!personnel) {
      return { success: false, error: "Personnel not found" }
    }

    // Log activity
    await Activity.create({
      type: "personnel-deploy",
      user: "Admin",
      userInitials: "AD",
      item: `${personnel.name} (${personnel.id})`,
      notes: `Assignment: ${assignment}, Location: ${location}. ${notes}`,
    })

    revalidatePath("/")
    revalidatePath("/personnel")

    return { success: true, data: JSON.parse(JSON.stringify(personnel)) }
  } catch (error) {
    console.error("Failed to assign personnel:", error)
    return { success: false, error: "Failed to assign personnel" }
  }
}

export async function returnPersonnel(formData: FormData) {
  try {
    await connectToDatabase()

    const personnelId = formData.get("personnelId") as string
    const status = formData.get("status") as string
    const unit = formData.get("unit") as string
    const notes = formData.get("notes") as string

    // Update personnel status
    const personnel = await Personnel.findOneAndUpdate(
      { id: personnelId },
      {
        status: status,
        unit: unit,
        notes: notes,
        lastUpdated: new Date(),
      },
      { new: true },
    )

    if (!personnel) {
      return { success: false, error: "Personnel not found" }
    }

    // Log activity
    await Activity.create({
      type: "personnel-return",
      user: "Admin",
      userInitials: "AD",
      item: `${personnel.name} (${personnel.id})`,
      notes: `Status: ${status}, Unit: ${unit}. ${notes}`,
    })

    revalidatePath("/")
    revalidatePath("/personnel")

    return { success: true, data: JSON.parse(JSON.stringify(personnel)) }
  } catch (error) {
    console.error("Failed to return personnel:", error)
    return { success: false, error: "Failed to return personnel" }
  }
}

export async function createPersonnel(formData: FormData) {
  try {
    await connectToDatabase()

    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const rank = formData.get("rank") as string
    const unit = formData.get("unit") as string
    const status = formData.get("status") as string
    const specialization = formData.get("specialization") as string
    const contactInfo = formData.get("contactInfo") as string
    const notes = formData.get("notes") as string

    // Check if personnel with this ID already exists
    const existingPersonnel = await Personnel.findOne({ id })
    if (existingPersonnel) {
      return { success: false, error: "Personnel with this ID already exists" }
    }

    // Create new personnel
    const personnel = new Personnel({
      id,
      name,
      rank,
      unit,
      status,
      specialization,
      contactInfo,
      notes,
      lastUpdated: new Date(),
    })

    await personnel.save()

    // Log activity
    await Activity.create({
      type: "personnel-create",
      user: "Admin",
      userInitials: "AD",
      item: `${name} (${id})`,
      notes: `Created new personnel record`,
    })

    revalidatePath("/")
    revalidatePath("/personnel")

    return { success: true, data: JSON.parse(JSON.stringify(personnel)) }
  } catch (error) {
    console.error("Failed to create personnel:", error)
    return { success: false, error: "Failed to create personnel" }
  }
}

export async function updatePersonnel(formData: FormData) {
  try {
    await connectToDatabase()

    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const rank = formData.get("rank") as string
    const unit = formData.get("unit") as string
    const status = formData.get("status") as string
    const specialization = formData.get("specialization") as string
    const contactInfo = formData.get("contactInfo") as string
    const notes = formData.get("notes") as string

    // Update personnel
    const personnel = await Personnel.findOneAndUpdate(
      { id },
      {
        name,
        rank,
        unit,
        status,
        specialization,
        contactInfo,
        notes,
        lastUpdated: new Date(),
      },
      { new: true },
    )

    if (!personnel) {
      return { success: false, error: "Personnel not found" }
    }

    // Log activity
    await Activity.create({
      type: "personnel-update",
      user: "Admin",
      userInitials: "AD",
      item: `${name} (${id})`,
      notes: `Updated personnel record`,
    })

    revalidatePath("/")
    revalidatePath("/personnel")
    revalidatePath(`/personnel/${id}`)

    return { success: true, data: JSON.parse(JSON.stringify(personnel)) }
  } catch (error) {
    console.error("Failed to update personnel:", error)
    return { success: false, error: "Failed to update personnel" }
  }
}

export async function deletePersonnel(id: string) {
  try {
    await connectToDatabase()

    // Get personnel details before deletion
    const personnel = await Personnel.findOne({ id })
    if (!personnel) {
      return { success: false, error: "Personnel not found" }
    }

    // Delete personnel
    await Personnel.findOneAndDelete({ id })

    // Log activity
    await Activity.create({
      type: "personnel-delete",
      user: "Admin",
      userInitials: "AD",
      item: `${personnel.name} (${id})`,
      notes: `Deleted personnel record`,
    })

    revalidatePath("/")
    revalidatePath("/personnel")

    return { success: true, message: "Personnel deleted successfully" }
  } catch (error) {
    console.error("Failed to delete personnel:", error)
    return { success: false, error: "Failed to delete personnel" }
  }
}

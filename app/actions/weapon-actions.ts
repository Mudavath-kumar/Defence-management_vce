"use server"

import connectToDatabase from "@/lib/mongodb"
import Weapon from "@/models/Weapon"
import Activity from "@/models/Activity"
import { revalidatePath } from "next/cache"

export async function getWeapons() {
  try {
    await connectToDatabase()
    const weapons = await Weapon.find({}).sort({ lastUpdated: -1 })
    return { success: true, data: JSON.parse(JSON.stringify(weapons)) }
  } catch (error) {
    console.error("Failed to fetch weapons:", error)
    return { success: false, error: "Failed to fetch weapons" }
  }
}

export async function checkoutWeapon(formData: FormData) {
  try {
    await connectToDatabase()

    const weaponId = formData.get("weaponId") as string
    const personnel = formData.get("personnel") as string
    const purpose = formData.get("purpose") as string
    const notes = formData.get("notes") as string

    // Update weapon status
    const weapon = await Weapon.findOneAndUpdate(
      { id: weaponId },
      {
        status: "Checked Out",
        assignedTo: personnel,
        notes: notes,
        lastUpdated: new Date(),
      },
      { new: true },
    )

    if (!weapon) {
      return { success: false, error: "Weapon not found" }
    }

    // Log activity
    await Activity.create({
      type: "weapon-checkout",
      user: personnel,
      userInitials: personnel
        .split(" ")
        .map((n) => n[0])
        .join(""),
      item: `${weapon.name} (${weapon.id})`,
      notes: `Purpose: ${purpose}. ${notes}`,
    })

    revalidatePath("/")
    revalidatePath("/weapons")

    return { success: true, data: JSON.parse(JSON.stringify(weapon)) }
  } catch (error) {
    console.error("Failed to checkout weapon:", error)
    return { success: false, error: "Failed to checkout weapon" }
  }
}

export async function checkinWeapon(formData: FormData) {
  try {
    await connectToDatabase()

    const weaponId = formData.get("weaponId") as string
    const condition = formData.get("condition") as string
    const location = formData.get("location") as string
    const notes = formData.get("notes") as string

    // Get current weapon to get assignedTo before updating
    const currentWeapon = await Weapon.findOne({ id: weaponId })
    if (!currentWeapon) {
      return { success: false, error: "Weapon not found" }
    }

    const assignedTo = currentWeapon.assignedTo

    // Update weapon status
    const weapon = await Weapon.findOneAndUpdate(
      { id: weaponId },
      {
        status: condition === "Poor - Needs Maintenance" ? "Maintenance" : "Available",
        location: location,
        assignedTo: undefined,
        condition: condition,
        notes: notes,
        lastUpdated: new Date(),
      },
      { new: true },
    )

    // Log activity
    await Activity.create({
      type: "weapon-checkin",
      user: assignedTo || "Unknown",
      userInitials: assignedTo
        ? assignedTo
            .split(" ")
            .map((n) => n[0])
            .join("")
        : "UN",
      item: `${weapon.name} (${weapon.id})`,
      notes: `Condition: ${condition}. ${notes}`,
    })

    revalidatePath("/")
    revalidatePath("/weapons")

    return { success: true, data: JSON.parse(JSON.stringify(weapon)) }
  } catch (error) {
    console.error("Failed to checkin weapon:", error)
    return { success: false, error: "Failed to checkin weapon" }
  }
}

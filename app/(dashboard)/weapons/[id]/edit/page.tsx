import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Weapon from "@/models/Weapon"
import WeaponForm from "@/components/weapon-form"

export const metadata: Metadata = {
  title: "Edit Weapon | Defence Management System",
  description: "Edit weapon details",
}

async function getWeapon(id: string) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  await connectToDatabase()

  const weapon = await Weapon.findOne({ id })

  if (!weapon) {
    return null
  }

  return JSON.parse(JSON.stringify(weapon))
}

export default async function EditWeaponPage({ params }: { params: { id: string } }) {
  const weapon = await getWeapon(params.id)

  if (!weapon) {
    notFound()
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Weapon</h1>
      <WeaponForm initialData={weapon} isEditing />
    </div>
  )
}

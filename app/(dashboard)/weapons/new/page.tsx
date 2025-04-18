import type { Metadata } from "next"
import WeaponForm from "@/components/weapon-form"

export const metadata: Metadata = {
  title: "Add New Weapon | Defence Management System",
  description: "Add a new weapon to the inventory",
}

export default function NewWeaponPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Weapon</h1>
      <WeaponForm />
    </div>
  )
}

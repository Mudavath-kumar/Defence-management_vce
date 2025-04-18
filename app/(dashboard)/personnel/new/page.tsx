import type { Metadata } from "next"
import PersonnelForm from "@/components/personnel-form"

export const metadata: Metadata = {
  title: "Add New Personnel | Defence Management System",
  description: "Add a new personnel to the system",
}

export default function NewPersonnelPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Personnel</h1>
      <PersonnelForm />
    </div>
  )
}

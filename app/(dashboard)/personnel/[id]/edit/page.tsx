import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import Personnel from "@/models/Personnel"
import PersonnelForm from "@/components/personnel-form"

export const metadata: Metadata = {
  title: "Edit Personnel | Defence Management System",
  description: "Edit personnel details",
}

async function getPersonnel(id: string) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  await connectToDatabase()

  const personnel = await Personnel.findOne({ id })

  if (!personnel) {
    return null
  }

  return JSON.parse(JSON.stringify(personnel))
}

export default async function EditPersonnelPage({ params }: { params: { id: string } }) {
  const personnel = await getPersonnel(params.id)

  if (!personnel) {
    notFound()
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Personnel</h1>
      <PersonnelForm initialData={personnel} isEditing />
    </div>
  )
}

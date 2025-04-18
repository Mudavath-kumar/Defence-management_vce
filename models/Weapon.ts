import mongoose, { Schema, type Document } from "mongoose"

export interface IWeapon extends Document {
  id: string
  name: string
  type: string
  status: "Available" | "Checked Out" | "Maintenance"
  location: string
  assignedTo?: string
  condition?: string
  lastUpdated: Date
  notes?: string
}

const WeaponSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: {
    type: String,
    enum: ["Available", "Checked Out", "Maintenance"],
    default: "Available",
  },
  location: { type: String, required: true },
  assignedTo: { type: String },
  condition: { type: String },
  lastUpdated: { type: Date, default: Date.now },
  notes: { type: String },
})

export default mongoose.models.Weapon || mongoose.model<IWeapon>("Weapon", WeaponSchema)

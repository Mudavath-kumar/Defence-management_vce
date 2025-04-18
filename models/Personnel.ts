import mongoose, { Schema, type Document } from "mongoose"

export interface IPersonnel extends Document {
  id: string
  name: string
  rank: string
  unit: string
  status: "Active" | "Deployed" | "On Leave" | "Medical" | "Inactive"
  specialization?: string
  contactInfo?: string
  notes?: string
  lastUpdated: Date
}

const PersonnelSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  rank: { type: String, required: true },
  unit: { type: String, required: true },
  status: {
    type: String,
    enum: ["Active", "Deployed", "On Leave", "Medical", "Inactive"],
    default: "Active",
  },
  specialization: { type: String },
  contactInfo: { type: String },
  notes: { type: String },
  lastUpdated: { type: Date, default: Date.now },
})

export default mongoose.models.Personnel || mongoose.model<IPersonnel>("Personnel", PersonnelSchema)

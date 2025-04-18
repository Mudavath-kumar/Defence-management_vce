import mongoose, { Schema, type Document } from "mongoose"

export interface IVehicle extends Document {
  id: string
  name: string
  type: string
  status: "Available" | "Deployed" | "Maintenance"
  location: string
  assignedTo?: string
  condition?: string
  fuelLevel?: string
  lastUpdated: Date
  notes?: string
}

const VehicleSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: {
    type: String,
    enum: ["Available", "Deployed", "Maintenance"],
    default: "Available",
  },
  location: { type: String, required: true },
  assignedTo: { type: String },
  condition: { type: String },
  fuelLevel: { type: String },
  lastUpdated: { type: Date, default: Date.now },
  notes: { type: String },
})

export default mongoose.models.Vehicle || mongoose.model<IVehicle>("Vehicle", VehicleSchema)

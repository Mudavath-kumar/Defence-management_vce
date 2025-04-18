import mongoose, { Schema, type Document } from "mongoose"

export interface IActivity extends Document {
  type: "weapon-checkout" | "weapon-checkin" | "vehicle-deploy" | "vehicle-return" | "maintenance"
  user: string
  userInitials: string
  item: string
  time: Date
  notes?: string
}

const ActivitySchema: Schema = new Schema({
  type: {
    type: String,
    enum: ["weapon-checkout", "weapon-checkin", "vehicle-deploy", "vehicle-return", "maintenance"],
    required: true,
  },
  user: { type: String, required: true },
  userInitials: { type: String, required: true },
  item: { type: String, required: true },
  time: { type: Date, default: Date.now },
  notes: { type: String },
})

export default mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema)

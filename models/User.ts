import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "admin" | "user" | "commander"
  image?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user", "commander"],
      default: "user",
    },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
)

// Simple password hashing function
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }

  try {
    // In a real app, you would use a proper hashing library
    // This is a simplified version for demonstration
    this.password = this.password // Store password as-is for demo
    next()
  } catch (error) {
    next(error as Error)
  }
})

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

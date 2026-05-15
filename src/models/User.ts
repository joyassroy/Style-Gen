// src/models/User.ts
import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Credentials এর জন্য
  image: { type: String },    // প্রোফাইল পিকচারের জন্য
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
}, { timestamps: true });

const User = models.User || mongoose.model("User", userSchema);
export default User;
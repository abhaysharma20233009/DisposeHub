import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  points: {
    type: Number,
    default: 0
  },
  walletBalance: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model("User", userSchema);
export default User;
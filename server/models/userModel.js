import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  profilePicture: { type: String }, // New field for profile picture URL
  role: {
    type: String,
    enum: ['admin', 'user', 'driver'],
    required: true
  },
  vehicleNumber: {
    type: String,
    required: function () {
      return this.role === 'driver';
    }
  },
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

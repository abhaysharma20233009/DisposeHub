import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },

  googleId: String,

  password: {
    type: String,
    required: function () {
      return this.provider === "local";
    },
    minlength: 8,
    select: false
  },

  passwordConfirm: {
    type: String,
    required: function () {
      return this.provider === "local";
    },
    validate: {
      validator: function (el) {
        if (this.provider !== "local") return true;
        return el === this.password;
      },
      message: "Passwords are not the same"
    }
  },

  avatar: String,
  profilePicture: String,

  role: {
    type: String,
    enum: ["admin", "user", "driver"],
    default: "user"
  },

  vehicleNumber: {
    type: String,
    required: function () {
      return this.role === "driver";
    }
  },

  points: {
    type: Number,
    default: 0
  },

  walletBalance: {
    type: Number,
    default: 0
  },

  passwordChangedAt: Date,
}, {
  timestamps: true
});

/* ================= PASSWORD ENCRYPT ================= */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

/* ================= PASSWORD CHECK ================= */

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/* ================= PASSWORD CHANGE CHECK ================= */

userSchema.methods.ChangedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);
export default User;

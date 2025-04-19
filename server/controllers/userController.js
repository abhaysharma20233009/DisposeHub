import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';

/**
 * Add a new user to the database after Firebase Signup
 * Expected Request Body: { firebaseUID, name, username, email }
 */
export const register = async (req, res) => {
    try {
      const { name, email, password, role, vehicleNumber } = req.body;
  
      // Basic validations
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Name, email, password, and role are required" });
      }
  
      if (role === 'driver' && !vehicleNumber) {
        return res.status(400).json({ message: "Vehicle number is required for drivers" });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        vehicleNumber: role === 'driver' ? vehicleNumber : undefined,
        walletBalance: 0
      });
  
      await newUser.save();
  
      res.status(201).json({
        message: "User registered successfully",
        user: {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          vehicleNumber: newUser.vehicleNumber || null,
          walletBalance: newUser.walletBalance
        }
      });
  
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  // Login User
  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  
      res.status(200).json({ message: "Login successful", user: { name: user.name, email: user.email } });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  // Google Login  
  export const addUser = async (req, res) => {
    try {
      const {
        firebaseUID, // Will be present only in Firebase-based signup
        name,
        email,
        password,     // Will be present only in traditional signup
        role = "user",
        vehicleNumber
      } = req.body;
  
      // Firebase-based signup
      if (firebaseUID) {
        if (!name || !email) {
          return res.status(400).json({ success: false, message: "Missing required fields" });
        }
  
        if (role === "driver" && !vehicleNumber) {
          return res.status(400).json({ success: false, message: "Vehicle number is required for drivers" });
        }
  
        const existingUser = await User.findOne({ firebaseUID });
        if (existingUser) {
          return res.status(400).json({ success: false, message: "User already exists" });
        }
  
        const newUser = new User({
          firebaseUID,
          name,
          email,
          role,
          vehicleNumber: role === "driver" ? vehicleNumber : undefined,
          walletBalance: 0
        });
  
        await newUser.save();
  
        return res.status(201).json({
          success: true,
          message: "Firebase user added successfully",
          user: {
            uid: newUser.firebaseUID,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            vehicleNumber: newUser.vehicleNumber || null,
            walletBalance: newUser.walletBalance,
          },
        });
      }
  
      // Traditional (non-Firebase) signup
      const { username } = req.body;
  
      if (!name || !email || !password || !username) {
        return res.status(400).json({ success: false, message: "Missing required fields for traditional signup" });
      }
  
      if (role === "driver" && !vehicleNumber) {
        return res.status(400).json({ success: false, message: "Vehicle number is required for drivers" });
      }
  
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: "Email is already registered" });
      }
  
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ success: false, message: "Username is already taken" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        username,
        password: hashedPassword,
        role,
        vehicleNumber: role === "driver" ? vehicleNumber : undefined,
        walletBalance: 0
      });
  
      await newUser.save();
  
      return res.status(201).json({
        success: true,
        message: "Traditional user registered successfully",
        user: {
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role,
          vehicleNumber: newUser.vehicleNumber || null,
          walletBalance: newUser.walletBalance,
        },
      });
  
    } catch (error) {
      console.error("Error adding user:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
  
/**
 * Fetch user by Firebase UID
 */
export const getUserByUID = async (req, res) => {
    try {
      const { uid } = req.params;
      console.log(`Looking for user with UID: [${uid}]`);
  
      const user = await User.findOne({ firebaseUID: uid.trim() });
      console.log("Found user:", user);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching user",
        error: error.message,
      });
    }
  };
  

/**
 * Update User - Allows updating only name, username & avatar
 * Expected Request Body: { name, username, avatar }
 */
export const updateUser = async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    console.log(firebaseUID+"uid");
    const { name, vehicleNumber } = req.body;

    if (!firebaseUID) {
      return res.status(400).json({ success: false, message: "Firebase UID is required" });
    }

    const user = await User.findOne({ firebaseUID:firebaseUID });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.name = name || user.name;
    user.vehicleNumber=vehicleNumber||user.vehicleNumber
    await user.save();

    res.status(200).json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating user", error: error.message });
  }
};

/**
 * Get All Users
 */
export const getAllUsers = async (req, res) => {    
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
  }
};

/**
 * Check if username is available
 */

export const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.params; // Extract username from params

    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(200).json({ success: false, message: "Username is taken" });
    }

    res.status(200).json({ success: true, message: "Username is available" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error checking username", error: error.message });
  }
};
const upload = multer({ dest: 'uploads/' }); 
export const uploadProfilePhoto = async (req, res) => {
  // Use Multer middleware to handle file upload

  const { uid } = req.params;
  console.log("uid"+uid);
  upload.single('profileImage')(req, res, async (err) => {
    if (err) return next(new AppError('Error uploading file', 400));

    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }

    try {
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Delete the file from temporary storage after uploading to Cloudinary
      fs.unlinkSync(req.file.path);

      // Update the user's profile with the Cloudinary URL
      const updatedUser = await User.findOneAndUpdate(
        { firebaseUID: uid }, // Use firebaseUID for finding the user
        { profilePicture: result.secure_url }, // Update the profile picture field
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        res.status(404).json({ success: false, message: "user not found" });
      }

      // Respond with success
      res.status(200).json({
        status: 'success',
        message: 'Profile photo uploaded successfully',
        data: {
          profilePicture: updatedUser.profilePicture
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Error in uploading picture", error: error.message });
    }
  });
};
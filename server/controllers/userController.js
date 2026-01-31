import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
import Email from "../utils/email.js";
import Notification from "../models/notificationModel.js"
import { getOne } from './handlerFactory.js';


export const getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};
  

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


export const getAllUsers = async (req, res) => {    
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
  }
};


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
export const getCurrentUser = getOne(User);
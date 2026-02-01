import { urlencoded } from "express";
import Location from "../models/locationModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";

export const saveLocation = async (req, res) => {
  try {
    const userId = req.user._id;
    const {lat, lng, locationName , active } = req.body;

    if (lat === undefined || lng === undefined || active === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const location = await Location.create({
      markedBy: userId,
      lat,
      long:lng,
      locationName,
      active,
    });
    
    return res.status(201).json({ success: true, message: 'Garbage location marked successfully', location });
  } catch (error) {
    console.error("Error saving location:", error);
    return res.status(500).json({ success: false, message: 'Error saving location', error: error.message });
  }
};

export const getActiveLocations = async (req, res) => {
  try {
    const locations = await Location.find({ active: true });

    if (locations.length === 0) {
      return res.status(404).json({ success: false, message: 'No active locations found' });
    }

    return res.status(200).json({ success: true, locations });
  } catch (error) {
    console.error("Error fetching active locations:", error);
    return res.status(500).json({ success: false, message: 'Error fetching active locations', error: error.message });
  }
};

export const deactivateLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    // Check if location exists before accessing its fields
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const firebaseUID = location.firebaseUID;
    const user = await User.findOne({ firebaseUID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("User found:", user);

    user.points += 10;
    user.walletBalance += 2;
    await user.save();
     // Create notification
        
        const content = `Your walletBalance updated to ${user.walletBalance}`;
    
        const newNotification = new Notification({
          receiver: user._id,
          messagePreview: content,
          isRead: false,
        });
        await newNotification.save();

      
    
    res.status(200).json({
      message: 'Location deactivated successfully',
      location,
    });
  } catch (err) {
    console.error('Error deactivating location:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

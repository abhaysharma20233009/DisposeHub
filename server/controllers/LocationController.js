import Location from "../models/locationModel.js"
import User from "../models/userModel.js"

export const saveLocation = async (req, res) => {
  try {
    const { firebaseUID, lat, long, active } = req.body;
    console.log(req.body);

    if (!firebaseUID || lat === undefined || long === undefined || active === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let location = await Location.findOne({ firebaseUID });

    if (location) {
      location.lat = lat;
      location.long = long;
      location.active = active;
      await location.save();
      return res.status(200).json({ success: true, message: 'Location updated successfully', location });
    }

    location = new Location({ firebaseUID, lat, long, active });
    console.log("location", location);
    await location.save();
    console.log(location);
    
    return res.status(201).json({ success: true, message: 'Location saved successfully', location });
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

    res.status(200).json({
      message: 'Location deactivated successfully',
      location,
    });
  } catch (err) {
    console.error('Error deactivating location:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Receiver of the notification
    messagePreview: { type: String, required: true }, // Short preview of the message
    
    isRead: { type: Boolean, default: false }, // Read/Unread status
    timestamp: { type: Date, default: Date.now },
  },
  
);


const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
<<<<<<< HEAD
  name: { type: String, unique: true },
  firebaseUID: {
    type: String,
=======
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
>>>>>>> main
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
  locationName: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Location = mongoose.model('Location', locationSchema);

export default Location;

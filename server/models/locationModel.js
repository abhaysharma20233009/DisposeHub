import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  firebaseUID: {
    type: String,
    required: true,
    unique: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
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

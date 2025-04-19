import mongoose from 'mongoose';

const GarbageSchema = new mongoose.Schema({
  name: {
    type: String,
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
}, {
  timestamps: true,
});

export default mongoose.models.Garbage || mongoose.model('Garbage', GarbageSchema);

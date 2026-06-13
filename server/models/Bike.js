import mongoose from 'mongoose';

const bikeSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Bike name is required'], trim: true },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    category: { type: String, default: 'Bike' },
  },
  { timestamps: true }
);

export default mongoose.model('Bike', bikeSchema);

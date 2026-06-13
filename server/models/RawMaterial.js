import mongoose from 'mongoose';

const qualitySchema = new mongoose.Schema({
  qualityName: { type: String, required: [true, 'Quality name is required'], trim: true },
  quantity: { type: Number, default: 0, min: 0 },
  price: { type: Number, default: 0, min: 0 },
  alertThreshold: { type: Number, default: 5, min: 0 },
});

const rawMaterialSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Material name is required'], trim: true },
    bike: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: [true, 'Bike reference is required'] },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    partType: {
      type: String,
      enum: ['Front', 'Rear', 'Brake Show', 'None'],
      default: 'None',
    },
    qualities: [qualitySchema],
  },
  { timestamps: true }
);

export default mongoose.model('RawMaterial', rawMaterialSchema);

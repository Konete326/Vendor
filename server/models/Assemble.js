import mongoose from 'mongoose';

const assembleItemSchema = new mongoose.Schema({
  material: { type: mongoose.Schema.Types.ObjectId, ref: 'RawMaterial', required: true },
  qualityName: { type: String, required: true },
  usedQuantity: { type: Number, required: true, min: 1 },
});

const assembleSchema = new mongoose.Schema(
  {
    assemblyType: {
      type: String,
      enum: ['Front', 'Rear', 'Brake Show'],
      required: [true, 'Assembly type is required'],
    },
    assemblyName: { type: String, trim: true },
    bike: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: [true, 'Bike reference is required'] },
    bikeCategory: { type: String, required: true },
    items: [assembleItemSchema],
    totalQuantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model('Assemble', assembleSchema);

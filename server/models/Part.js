import mongoose from 'mongoose';

const partSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Part name is required'], trim: true },
    sku: { type: String, unique: true, sparse: true, trim: true, uppercase: true },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['spring', 'seal', 'damper', 'valve', 'suspension', 'brakes', 'electrical', 'other', 'engine', 'frame', 'transmission'],
    },
    brand: { type: String, required: [true, 'Brand is required'], trim: true },
    modelCompatibility: [{ type: String, trim: true }],
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    gradePrices: {
      gradeA: { type: Number, min: 0, default: 0 },
      gradeB: { type: Number, min: 0, default: 0 },
      gradeC: { type: Number, min: 0, default: 0 },
      gradeD: { type: Number, min: 0, default: 0 },
    },
    description: { type: String, trim: true },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    stock: { type: Number, default: 0, min: 0 },
    unit: { type: String, default: 'piece', trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

partSchema.index({ category: 1 });
partSchema.index({ name: 'text', sku: 'text' });

const Part = mongoose.model('Part', partSchema);
export default Part;

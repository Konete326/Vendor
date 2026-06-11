import mongoose from 'mongoose';

const stockEntrySchema = new mongoose.Schema(
  {
    part: { type: mongoose.Schema.Types.ObjectId, ref: 'Part', required: [true, 'Part reference is required'] },
    quantity: { type: Number, required: [true, 'Quantity is required'], min: 1 },
    type: { type: String, required: true, enum: ['in', 'out'] },
    supplier: { type: String, trim: true },
    costPerUnit: { type: Number, min: 0, default: 0 },
    notes: { type: String, trim: true },
    enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

stockEntrySchema.virtual('totalCost').get(function () {
  return this.costPerUnit * this.quantity;
});

stockEntrySchema.post('save', async function () {
  const Part = mongoose.model('Part');
  const modifier = this.type === 'in' ? this.quantity : -this.quantity;
  await Part.findByIdAndUpdate(this.part, { $inc: { stock: modifier } });
});

const StockEntry = mongoose.model('StockEntry', stockEntrySchema);
export default StockEntry;

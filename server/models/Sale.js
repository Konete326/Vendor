import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  source: { type: String, enum: ['Raw Material', 'Ready to Sale'], required: true },
  itemRef: { type: mongoose.Schema.Types.ObjectId, required: true },
  qualityName: { type: String },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const saleSchema = new mongoose.Schema(
  {
    items: [saleItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    receivedAmount: { type: Number, required: true, min: 0 },
    dueAmount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Online', 'Partial'],
      required: true,
    },
    customerName: { type: String, required: true, trim: true },
    bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike' },
    bikeName: { type: String },
    saleDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Sale', saleSchema);

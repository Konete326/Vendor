import mongoose from 'mongoose';

const bulkStockEntrySchema = new mongoose.Schema(
  {
    supplierName: { type: String, required: [true, 'Supplier name is required'], trim: true },
    invoiceRef: { type: String, trim: true },
    totalCost: { type: Number, required: true, min: 0 },
    items: [
      {
        part: { type: mongoose.Schema.Types.ObjectId, ref: 'Part', required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitCost: { type: Number, required: true, min: 0 },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

bulkStockEntrySchema.post('save', async function () {
  const Part = mongoose.model('Part');
  for (const item of this.items) {
    await Part.findByIdAndUpdate(item.part, { $inc: { stock: item.quantity } });
  }
});

const BulkStockEntry = mongoose.model('BulkStockEntry', bulkStockEntrySchema);
export default BulkStockEntry;

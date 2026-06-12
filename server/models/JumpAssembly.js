import mongoose from 'mongoose';

const jumpAssemblySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Assembly name is required'], trim: true },
    bikeCategory: {
      type: String,
      required: [true, 'Bike category is required'],
      enum: ['70cc', '125cc', '150cc', 'Other'],
    },
    parts: [
      {
        part: { type: mongoose.Schema.Types.ObjectId, ref: 'Part', required: true },
        quantity: { type: Number, required: true, min: 1 },
        qualityGrade: {
          type: String,
          enum: ['Grade A', 'Grade B', 'Grade C', 'Grade D'],
          default: 'Grade B',
        },
      },
    ],
    totalCost: { type: Number, default: 0, min: 0 },
    assembledBy: { type: String, required: [true, 'Worker name is required'], trim: true },
    status: { type: String, enum: ['Pending', 'Ready'], default: 'Pending' },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const JumpAssembly = mongoose.model('JumpAssembly', jumpAssemblySchema);
export default JumpAssembly;

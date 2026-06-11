import mongoose from 'mongoose';

const jumpAssemblySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Assembly name is required'], trim: true },
    displacement: {
      type: String,
      required: [true, 'Displacement is required'],
      enum: ['70cc', '100cc', '110cc', '125cc', '150cc'],
    },
    parts: [
      {
        part: { type: mongoose.Schema.Types.ObjectId, ref: 'Part', required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'in-progress', 'completed', 'quality-checked'],
      default: 'draft',
    },
    qualityGrade: { type: String, enum: ['A', 'B', 'C'] },
    notes: { type: String, trim: true },
    assembledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

const JumpAssembly = mongoose.model('JumpAssembly', jumpAssemblySchema);
export default JumpAssembly;

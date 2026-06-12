import JumpAssembly from '../models/JumpAssembly.js';
import Part from '../models/Part.js';
import { getPriceForGrade, calculateAssemblyTotal } from '../utils/partPricing.js';

const populateParts = async (partsInput) => {
  const partIds = partsInput.map((p) => p.part);
  const dbParts = await Part.find({ _id: { $in: partIds } }).lean();
  const partMap = Object.fromEntries(dbParts.map((p) => [p._id.toString(), p]));

  return partsInput.map((item) => {
    const partDoc = partMap[item.part.toString()];
    if (!partDoc) throw new Error('One or more referenced parts do not exist');
    if (partDoc.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${partDoc.name}. Available: ${partDoc.stock}`);
    }
    return {
      ...item,
      partDoc,
      unitPrice: getPriceForGrade(partDoc, item.qualityGrade || 'Grade B'),
    };
  });
};

export const createJump = async (req, res, next) => {
  try {
    const { name, bikeCategory, parts, assembledBy, notes } = req.body;

    if (!parts?.length) {
      res.status(400);
      return next(new Error('At least one part is required'));
    }

    const enriched = await populateParts(parts);
    const totalCost = calculateAssemblyTotal(enriched);

    for (const item of enriched) {
      await Part.findByIdAndUpdate(item.part, { $inc: { stock: -item.quantity } });
    }

    const assembly = await JumpAssembly.create({
      name,
      bikeCategory,
      parts: parts.map((p) => ({
        part: p.part,
        quantity: p.quantity,
        qualityGrade: p.qualityGrade || 'Grade B',
      })),
      totalCost,
      assembledBy,
      notes,
      status: 'Pending',
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Assembly ticket created', data: assembly });
  } catch (error) {
    next(error);
  }
};

export const getJumps = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {};

    if (req.query.bikeCategory) filter.bikeCategory = req.query.bikeCategory;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.worker) filter.assembledBy = { $regex: req.query.worker, $options: 'i' };

    const total = await JumpAssembly.countDocuments(filter);
    const jumps = await JumpAssembly.find(filter)
      .populate('parts.part', 'name category brand sku price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      message: 'Jump assemblies retrieved',
      data: { jumps, page, pages: Math.ceil(total / limit), total },
    });
  } catch (error) {
    next(error);
  }
};

export const getJumpById = async (req, res, next) => {
  try {
    const assembly = await JumpAssembly.findById(req.params.id)
      .populate('parts.part', 'name category brand sku price gradePrices stock')
      .populate('createdBy', 'name email')
      .lean();

    if (!assembly) {
      res.status(404);
      return next(new Error('Jump assembly not found'));
    }

    res.json({ success: true, message: 'Jump assembly retrieved', data: assembly });
  } catch (error) {
    next(error);
  }
};

export const updateJumpStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const assembly = await JumpAssembly.findById(req.params.id);

    if (!assembly) {
      res.status(404);
      return next(new Error('Jump assembly not found'));
    }

    if (!['Pending', 'Ready'].includes(status)) {
      res.status(400);
      return next(new Error('Invalid status'));
    }

    assembly.status = status;
    const updated = await assembly.save();

    res.json({ success: true, message: 'Assembly status updated', data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteJump = async (req, res, next) => {
  try {
    const assembly = await JumpAssembly.findById(req.params.id);
    if (!assembly) {
      res.status(404);
      return next(new Error('Jump assembly not found'));
    }
    await assembly.deleteOne();
    res.json({ success: true, message: 'Jump assembly deleted', data: null });
  } catch (error) {
    next(error);
  }
};

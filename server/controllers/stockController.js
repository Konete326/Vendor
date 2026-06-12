import StockEntry from '../models/StockEntry.js';
import BulkStockEntry from '../models/BulkStockEntry.js';
import Part from '../models/Part.js';

// @desc    Add a stock entry
// @route   POST /api/stock
// @access  Protected
export const addStockEntry = async (req, res, next) => {
  try {
    const { part, quantity, type, supplier, costPerUnit, notes } = req.body;

    const existingPart = await Part.findById(part);
    if (!existingPart) {
      res.status(404);
      return next(new Error('Part not found'));
    }

    if (type === 'out' && existingPart.stock < quantity) {
      res.status(400);
      return next(new Error(`Insufficient stock. Available: ${existingPart.stock}, Requested: ${quantity}`));
    }

    const entry = await StockEntry.create({
      part,
      quantity,
      type,
      supplier,
      costPerUnit,
      notes,
      enteredBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Stock entry added', data: entry });
  } catch (error) {
    next(error);
  }
};

export const addBulkStockEntry = async (req, res, next) => {
  try {
    const { supplierName, invoiceRef, items } = req.body;

    if (!supplierName || !items?.length) {
      res.status(400);
      return next(new Error('Supplier name and at least one item are required'));
    }

    for (const item of items) {
      const partDoc = await Part.findById(item.part);
      if (!partDoc) {
        res.status(404);
        return next(new Error('Part not found'));
      }
    }

    const totalCost = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);

    const entry = await BulkStockEntry.create({
      supplierName,
      invoiceRef,
      totalCost,
      items,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Bulk stock entry created', data: entry });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all stock entries (paginated)
// @route   GET /api/stock
// @access  Protected
export const getStockEntries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.supplier) filter.supplierName = { $regex: req.query.supplier, $options: 'i' };
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
    }

    const [entries, total] = await Promise.all([
      BulkStockEntry.find(filter)
        .populate('items.part', 'name sku category')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BulkStockEntry.countDocuments(filter),
    ]);

    res.json({
      success: true,
      message: 'Stock entries retrieved',
      data: { entries, page, pages: Math.ceil(total / limit), total },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single stock entry by ID
// @route   GET /api/stock/:id
// @access  Protected
export const getStockEntryById = async (req, res, next) => {
  try {
    const entry = await BulkStockEntry.findById(req.params.id)
      .populate('items.part', 'name category brand sku')
      .populate('createdBy', 'name email')
      .lean();

    if (!entry) {
      res.status(404);
      return next(new Error('Stock entry not found'));
    }

    res.json({ success: true, message: 'Stock entry retrieved', data: entry });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a stock entry (reverses stock change)
// @route   DELETE /api/stock/:id
// @access  Protected, Admin
export const deleteStockEntry = async (req, res, next) => {
  try {
    const entry = await BulkStockEntry.findById(req.params.id);

    if (!entry) {
      res.status(404);
      return next(new Error('Stock entry not found'));
    }

    for (const item of entry.items) {
      await Part.findByIdAndUpdate(item.part, { $inc: { stock: -item.quantity } });
    }

    await entry.deleteOne();

    res.json({ success: true, message: 'Stock entry deleted and stock adjusted', data: null });
  } catch (error) {
    next(error);
  }
};

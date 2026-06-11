import Part from '../models/Part.js';
import { uploadImage, deleteImage } from '../utils/cloudinaryUpload.js';

// @desc    Create a new part
// @route   POST /api/parts
// @access  Private/Vendor
const createPart = async (req, res, next) => {
  try {
    const { name, category, brand, modelCompatibility, price, description, unit } = req.body;

    let image = { url: '', publicId: '' };
    if (req.file) {
      image = await uploadImage(req.file.buffer, 'vendor/parts');
    }

    const part = await Part.create({
      name,
      category,
      brand,
      modelCompatibility: modelCompatibility
        ? Array.isArray(modelCompatibility)
          ? modelCompatibility
          : modelCompatibility.split(',').map((m) => m.trim())
        : [],
      price,
      description,
      unit,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Part created successfully', data: part });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all parts (paginated, filterable)
// @route   GET /api/parts
// @access  Public
const getParts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const [parts, total] = await Promise.all([
      Part.find(filter).skip(skip).limit(limit).lean(),
      Part.countDocuments(filter),
    ]);

    res.json({
      success: true,
      message: 'Parts fetched successfully',
      data: { parts, page, pages: Math.ceil(total / limit), total },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single part by ID
// @route   GET /api/parts/:id
// @access  Public
const getPartById = async (req, res, next) => {
  try {
    const part = await Part.findById(req.params.id).lean();
    if (!part) {
      res.status(404);
      return next(new Error('Part not found'));
    }
    res.json({ success: true, message: 'Part fetched successfully', data: part });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a part
// @route   PUT /api/parts/:id
// @access  Private/Vendor
const updatePart = async (req, res, next) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      res.status(404);
      return next(new Error('Part not found'));
    }

    const fields = ['name', 'category', 'brand', 'modelCompatibility', 'price', 'description', 'unit'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) part[f] = req.body[f];
    });

    if (req.body.modelCompatibility && !Array.isArray(req.body.modelCompatibility)) {
      part.modelCompatibility = req.body.modelCompatibility.split(',').map((m) => m.trim());
    }

    if (req.file) {
      if (part.image?.publicId) await deleteImage(part.image.publicId);
      part.image = await uploadImage(req.file.buffer, 'vendor/parts');
    }

    const updated = await part.save();
    res.json({ success: true, message: 'Part updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a part
// @route   DELETE /api/parts/:id
// @access  Private/Admin
const deletePart = async (req, res, next) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      res.status(404);
      return next(new Error('Part not found'));
    }

    if (part.image?.publicId) await deleteImage(part.image.publicId);
    await part.deleteOne();

    res.json({ success: true, message: 'Part deleted successfully', data: null });
  } catch (error) {
    next(error);
  }
};

export { createPart, getParts, getPartById, updatePart, deletePart };

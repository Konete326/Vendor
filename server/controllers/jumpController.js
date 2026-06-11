import JumpAssembly from '../models/JumpAssembly.js';
import Part from '../models/Part.js';

// @desc    Create a new jump assembly
// @route   POST /api/jumps
// @access  Protected
export const createJump = async (req, res, next) => {
  try {
    const { name, displacement, parts, notes } = req.body;

    if (!parts || parts.length === 0) {
      res.status(400);
      return next(new Error('At least one part is required'));
    }

    const partIds = parts.map((p) => p.part);
    const existingParts = await Part.find({ _id: { $in: partIds } }).lean();

    if (existingParts.length !== partIds.length) {
      res.status(400);
      return next(new Error('One or more referenced parts do not exist'));
    }

    const assembly = await JumpAssembly.create({
      name,
      displacement,
      parts,
      notes,
      assembledBy: req.user._id,
      status: 'draft',
    });

    res.status(201).json({ success: true, message: 'Jump assembly created', data: assembly });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jump assemblies (paginated)
// @route   GET /api/jumps
// @access  Protected
export const getJumps = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.displacement) filter.displacement = req.query.displacement;
    if (req.query.status) filter.status = req.query.status;

    const total = await JumpAssembly.countDocuments(filter);

    const jumps = await JumpAssembly.find(filter)
      .populate('parts.part', 'name category brand')
      .populate('assembledBy', 'name')
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

// @desc    Get jump assembly by ID
// @route   GET /api/jumps/:id
// @access  Protected
export const getJumpById = async (req, res, next) => {
  try {
    const assembly = await JumpAssembly.findById(req.params.id)
      .populate('parts.part', 'name category brand price stock')
      .populate('assembledBy', 'name email')
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

// @desc    Update a jump assembly
// @route   PUT /api/jumps/:id
// @access  Protected
export const updateJump = async (req, res, next) => {
  try {
    const assembly = await JumpAssembly.findById(req.params.id);

    if (!assembly) {
      res.status(404);
      return next(new Error('Jump assembly not found'));
    }

    const { name, displacement, parts, status, qualityGrade, notes } = req.body;

    if (name !== undefined) assembly.name = name;
    if (displacement !== undefined) assembly.displacement = displacement;
    if (parts !== undefined) assembly.parts = parts;
    if (qualityGrade !== undefined) assembly.qualityGrade = qualityGrade;
    if (notes !== undefined) assembly.notes = notes;

    if (status !== undefined) {
      if (status === 'completed' && assembly.status !== 'completed') {
        assembly.completedAt = Date.now();
      }
      assembly.status = status;
    }

    const updated = await assembly.save();

    res.json({ success: true, message: 'Jump assembly updated', data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a jump assembly
// @route   DELETE /api/jumps/:id
// @access  Protected, Admin only
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

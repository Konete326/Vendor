import RawMaterial from '../models/RawMaterial.js';
import Assemble from '../models/Assemble.js';
import { uploadImage, deleteImage } from '../utils/cloudinaryUpload.js';

export const createRawMaterial = async (req, res, next) => {
  try {
    const { name, bike, partType, qualities } = req.body;
    if (!name || !bike) {
      res.status(400);
      return next(new Error('Name and Bike ID are required'));
    }
    let parsedQualities = [];
    if (qualities) {
      parsedQualities = typeof qualities === 'string' ? JSON.parse(qualities) : qualities;
    }
    let image = { url: '', publicId: '' };
    if (req.file) {
      image = await uploadImage(req.file.buffer, 'vendor/materials');
    }
    const material = await RawMaterial.create({
      name,
      bike,
      partType: partType || 'None',
      image,
      qualities: parsedQualities,
    });
    res.status(201).json({ success: true, message: 'Raw material created successfully', data: material });
  } catch (error) {
    next(error);
  }
};

export const getRawMaterials = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.bike) filter.bike = req.query.bike;
    if (req.query.partType) filter.partType = req.query.partType;
    const materials = await RawMaterial.find(filter).populate('bike', 'name').sort({ createdAt: -1 }).lean();
    res.json({ success: true, message: 'Raw materials fetched', data: materials });
  } catch (error) {
    next(error);
  }
};

export const updateRawMaterial = async (req, res, next) => {
  try {
    const { name, bike, partType, qualities } = req.body;
    const material = await RawMaterial.findById(req.params.id);
    if (!material) {
      res.status(404);
      return next(new Error('Material not found'));
    }
    if (name) material.name = name;
    if (bike) material.bike = bike;
    if (partType) material.partType = partType;
    if (qualities) {
      material.qualities = typeof qualities === 'string' ? JSON.parse(qualities) : qualities;
    }
    if (req.file) {
      if (material.image?.publicId) await deleteImage(material.image.publicId);
      material.image = await uploadImage(req.file.buffer, 'vendor/materials');
    }
    const updated = await material.save();
    res.json({ success: true, message: 'Raw material updated', data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteRawMaterial = async (req, res, next) => {
  try {
    const material = await RawMaterial.findById(req.params.id);
    if (!material) {
      res.status(404);
      return next(new Error('Material not found'));
    }
    const linked = await Assemble.findOne({ 'items.material': req.params.id });
    if (linked) {
      res.status(400);
      return next(new Error('Cannot delete. This material is used in assemblies.'));
    }
    if (material.image?.publicId) await deleteImage(material.image.publicId);
    await material.deleteOne();
    res.json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req, res, next) => {
  try {
    const { qualityName, quantity, mode } = req.body;
    if (!qualityName || quantity === undefined || !mode) {
      res.status(400);
      return next(new Error('qualityName, quantity, and mode are required'));
    }
    const material = await RawMaterial.findById(req.params.id);
    if (!material) {
      res.status(404);
      return next(new Error('Material not found'));
    }
    const qIndex = material.qualities.findIndex((q) => q.qualityName === qualityName);
    if (qIndex === -1) {
      res.status(404);
      return next(new Error(`Quality '${qualityName}' not found`));
    }
    const num = Number(quantity);
    if (mode === 'add') {
      material.qualities[qIndex].quantity += num;
    } else {
      material.qualities[qIndex].quantity = num;
    }
    await material.save();
    res.json({ success: true, message: 'Stock updated successfully', data: material });
  } catch (error) {
    next(error);
  }
};

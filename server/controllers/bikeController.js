import Bike from '../models/Bike.js';
import RawMaterial from '../models/RawMaterial.js';
import { uploadImage, deleteImage } from '../utils/cloudinaryUpload.js';

export const createBike = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400);
      return next(new Error('Bike name is required'));
    }
    let image = { url: '', publicId: '' };
    if (req.file) {
      image = await uploadImage(req.file.buffer, 'vendor/bikes');
    }
    const bike = await Bike.create({ name, image });
    res.status(201).json({ success: true, message: 'Bike created successfully', data: bike });
  } catch (error) {
    next(error);
  }
};

export const getBikes = async (req, res, next) => {
  try {
    const bikes = await Bike.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, message: 'Bikes fetched successfully', data: bikes });
  } catch (error) {
    next(error);
  }
};

export const updateBike = async (req, res, next) => {
  try {
    const { name } = req.body;
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
      res.status(404);
      return next(new Error('Bike not found'));
    }
    if (name) bike.name = name;
    if (req.file) {
      if (bike.image?.publicId) await deleteImage(bike.image.publicId);
      bike.image = await uploadImage(req.file.buffer, 'vendor/bikes');
    }
    const updated = await bike.save();
    res.json({ success: true, message: 'Bike updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteBike = async (req, res, next) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
      res.status(404);
      return next(new Error('Bike not found'));
    }
    const linked = await RawMaterial.findOne({ bike: req.params.id });
    if (linked) {
      res.status(400);
      return next(new Error('Cannot delete bike. It has configured raw materials.'));
    }
    if (bike.image?.publicId) await deleteImage(bike.image.publicId);
    await bike.deleteOne();
    res.json({ success: true, message: 'Bike deleted successfully' });
  } catch (error) {
    next(error);
  }
};

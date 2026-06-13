import Assemble from '../models/Assemble.js';
import RawMaterial from '../models/RawMaterial.js';

export const createAssemble = async (req, res, next) => {
  try {
    const { assemblyType, assemblyName, bike, bikeCategory, items, totalQuantity } = req.body;
    if (!assemblyType || !bike || !bikeCategory || !items || !totalQuantity) {
      res.status(400);
      return next(new Error('Missing required fields'));
    }
    const tQty = Number(totalQuantity);
    for (const item of items) {
      const mat = await RawMaterial.findById(item.material);
      const q = mat?.qualities.find((x) => x.qualityName === item.qualityName);
      const needed = Number(item.usedQuantity) * tQty;
      if (!q || q.quantity < needed) {
        res.status(400);
        return next(new Error(`Insufficient stock for ${mat?.name} (${item.qualityName})`));
      }
    }
    for (const item of items) {
      const needed = Number(item.usedQuantity) * tQty;
      await RawMaterial.updateOne(
        { _id: item.material, 'qualities.qualityName': item.qualityName },
        { $inc: { 'qualities.$.quantity': -needed } }
      );
    }
    let assemble = await Assemble.findOne({ assemblyType, assemblyName: assemblyName || '', bike, bikeCategory });
    if (assemble) {
      assemble.totalQuantity += tQty;
      await assemble.save();
    } else {
      assemble = await Assemble.create({ assemblyType, assemblyName: assemblyName || '', bike, bikeCategory, items, totalQuantity: tQty });
    }
    res.status(201).json({ success: true, message: 'Assembly recorded', data: assemble });
  } catch (error) { next(error); }
};

export const getAssembles = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.bike) filter.bike = req.query.bike;
    if (req.query.assemblyType) filter.assemblyType = req.query.assemblyType;
    const assemblies = await Assemble.find(filter).populate('bike', 'name').populate('items.material', 'name qualities image').sort({ createdAt: -1 }).lean();
    res.json({ success: true, message: 'Assemblies fetched', data: assemblies });
  } catch (error) { next(error); }
};

export const updateAssemble = async (req, res, next) => {
  try {
    const { totalQuantity } = req.body;
    const assemble = await Assemble.findById(req.params.id);
    if (!assemble) {
      res.status(404);
      return next(new Error('Assembly not found'));
    }
    const oldQty = assemble.totalQuantity;
    const newQty = Number(totalQuantity);
    const diff = newQty - oldQty;
    if (diff > 0) {
      for (const item of assemble.items) {
        const mat = await RawMaterial.findById(item.material);
        const q = mat?.qualities.find((x) => x.qualityName === item.qualityName);
        if (!q || q.quantity < (item.usedQuantity * diff)) {
          res.status(400);
          return next(new Error(`Insufficient stock for ${mat?.name || 'material'}`));
        }
      }
    }
    for (const item of assemble.items) {
      const adjust = item.usedQuantity * diff;
      await RawMaterial.updateOne({ _id: item.material, 'qualities.qualityName': item.qualityName }, { $inc: { 'qualities.$.quantity': -adjust } });
    }
    assemble.totalQuantity = newQty;
    await assemble.save();
    res.json({ success: true, message: 'Assembly updated successfully', data: assemble });
  } catch (error) { next(error); }
};

export const deleteAssemble = async (req, res, next) => {
  try {
    const assemble = await Assemble.findById(req.params.id);
    if (!assemble) {
      res.status(404);
      return next(new Error('Assembly not found'));
    }
    for (const item of assemble.items) {
      const restore = item.usedQuantity * assemble.totalQuantity;
      await RawMaterial.updateOne({ _id: item.material, 'qualities.qualityName': item.qualityName }, { $inc: { 'qualities.$.quantity': restore } });
    }
    await assemble.deleteOne();
    res.json({ success: true, message: 'Assembly deleted and stock restored' });
  } catch (error) { next(error); }
};

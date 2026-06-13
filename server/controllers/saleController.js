import Sale from '../models/Sale.js';
import RawMaterial from '../models/RawMaterial.js';
import Assemble from '../models/Assemble.js';

export const createSale = async (req, res, next) => {
  try {
    const { items, totalAmount, receivedAmount, dueAmount, paymentMethod, customerName, bikeId, bikeName } = req.body;
    if (!items || !items.length || !customerName || !paymentMethod) {
      res.status(400);
      return next(new Error('Missing required sale information'));
    }
    for (const item of items) {
      const qty = Number(item.quantity);
      if (item.source === 'Raw Material') {
        const mat = await RawMaterial.findById(item.itemRef);
        const q = mat?.qualities.find((x) => x.qualityName === item.qualityName);
        if (!q || q.quantity < qty) {
          res.status(400);
          return next(new Error(`Insufficient stock for Raw Material: ${item.name} (${item.qualityName})`));
        }
      } else if (item.source === 'Ready to Sale') {
        const asm = await Assemble.findById(item.itemRef);
        if (!asm || asm.totalQuantity < qty) {
          res.status(400);
          return next(new Error(`Insufficient stock for Ready to Sale Assembly: ${item.name}`));
        }
      }
    }
    for (const item of items) {
      const qty = Number(item.quantity);
      if (item.source === 'Raw Material') {
        await RawMaterial.updateOne({ _id: item.itemRef, 'qualities.qualityName': item.qualityName }, { $inc: { 'qualities.$.quantity': -qty } });
      } else if (item.source === 'Ready to Sale') {
        await Assemble.updateOne({ _id: item.itemRef }, { $inc: { totalQuantity: -qty } });
      }
    }
    const sale = await Sale.create({
      items,
      totalAmount: Number(totalAmount),
      receivedAmount: Number(receivedAmount),
      dueAmount: Number(dueAmount),
      paymentMethod,
      customerName,
      bikeId: bikeId || null,
      bikeName: bikeName || '',
    });
    res.status(201).json({ success: true, message: 'Sale created successfully', data: sale });
  } catch (error) { next(error); }
};

export const getSales = async (req, res, next) => {
  try {
    const filter = {};
    const { customerName, paymentStatus, bikeId, date, month, year } = req.query;
    if (customerName) filter.customerName = { $regex: customerName, $options: 'i' };
    if (bikeId) filter.bikeId = bikeId;
    if (paymentStatus) {
      if (paymentStatus === 'Paid') filter.dueAmount = 0;
      else if (paymentStatus === 'Due') filter.dueAmount = { $gt: 0 };
    }
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.saleDate = { $gte: start, $lt: end };
    } else if (month && year) {
      const m = parseInt(month) - 1;
      const y = parseInt(year);
      filter.saleDate = { $gte: new Date(y, m, 1), $lt: new Date(y, m + 1, 1) };
    } else if (year) {
      const y = parseInt(year);
      filter.saleDate = { $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1) };
    }
    const sales = await Sale.find(filter).sort({ saleDate: -1 }).lean();
    let totalSales = 0, totalReceived = 0, totalDue = 0;
    sales.forEach((s) => {
      totalSales += s.totalAmount || 0;
      totalReceived += s.receivedAmount || 0;
      totalDue += s.dueAmount || 0;
    });
    res.json({ success: true, message: 'Sales fetched', data: { sales, totalSales, totalReceived, totalDue } });
  } catch (error) { next(error); }
};

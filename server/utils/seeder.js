import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const exists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (exists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    await User.create({
      name: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
    });

    console.log('Admin user seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeder error:', error.message);
    process.exit(1);
  }
};

seedAdmin();

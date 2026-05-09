import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = process.argv[2] || 'admin@example.com';
    const username = process.argv[3] || 'admin';
    const password = process.argv[4] || 'AdminPass123!';

    let existing = await User.findOne({ email });
    if (existing) {
      console.log('User already exists:', existing._id.toString());
      const token = generateToken(existing);
      console.log('TOKEN=' + token);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashed,
      role: 'ADMIN',
      status: 'active',
    });

    console.log('Created admin user id=', user._id.toString());
    const token = generateToken(user);
    console.log('TOKEN=' + token);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

run();

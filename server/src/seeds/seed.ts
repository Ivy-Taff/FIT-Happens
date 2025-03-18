import db from '../config/connection.js';
import { User } from '../models/index.js';
import cleanDB from './cleanDB.js';
import dotenv from 'dotenv';

dotenv.config();

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL as string;
const X_API_KEY = process.env.X_API_KEY as string;

import userData from './userData.json' with { type: 'json' };

if (!EXTERNAL_API_URL || !X_API_KEY) {
  console.error('Missing environment variables. Please check your .env file');
  process.exit(1);
}

const seedDatabase = async (): Promise<void> => {
  try {
    await db();
    await cleanDB();
    await User.create(userData);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
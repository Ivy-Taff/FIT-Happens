import db from '../config/connection.js';
import { User, Exercise } from '../models/index.js';
import cleanDB from './cleanDB.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL as string;
const X_API_KEY = process.env.X_API_KEY as string;

import userData from './userData.json' with { type: 'json' };

const seedDatabase = async (): Promise<void> => {
  try {
    await db();
    await cleanDB();

    // Seed user data
    await User.create(userData);

    // Fetch exercises from external API
    const { data } = await axios.get(EXTERNAL_API_URL, {
      headers: { 'X-Api-Key': X_API_KEY }
    });

    const exercises = data.map((ex: any) => ({
      _id: ex._id,
      name: ex.name,
      type: ex.type,
      muscle: ex.muscle,
      equipment: ex.equipment,
      difficulty: ex.difficulty,
      instructions: ex.instructions,
    }));

    // Seed exercise data
    await Exercise.insertMany(exercises);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
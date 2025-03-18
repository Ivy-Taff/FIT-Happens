import db from '../config/connection.js';
import { User, Exercise } from '../models/index.js';
import cleanDB from './cleanDB.js';
import axios from 'axios';
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

    // Fetch exercises from external API
    const { data } = await axios.get(EXTERNAL_API_URL, {
      headers: { 'X-Api-Key': X_API_KEY }
    });

    for (const ex of data) {
      const existingExercise = await Exercise.findOne({ _id: ex._id });

      if (existingExercise) {
        // Check for changes and update if necessary
        if (
          existingExercise.name !== ex.name ||
          existingExercise.type !== ex.type ||
          existingExercise.muscle !== ex.muscle ||
          existingExercise.equipment !== ex.equipment ||
          existingExercise.difficulty !== ex.difficulty ||
          existingExercise.instructions !== ex.instructions
        ) {
          existingExercise.name = ex.name;
          existingExercise.type = ex.type;
          existingExercise.muscle = ex.muscle;
          existingExercise.equipment = ex.equipment;
          existingExercise.difficulty = ex.difficulty;
          existingExercise.instructions = ex.instructions;
          await existingExercise.save();
        }
      } else {
        // Insert new exercise
        const newExercise = new Exercise({
          _id: ex._id,
          name: ex.name,
          type: ex.type,
          muscle: ex.muscle,
          equipment: ex.equipment,
          difficulty: ex.difficulty,
          instructions: ex.instructions,
        });
        await newExercise.save();
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
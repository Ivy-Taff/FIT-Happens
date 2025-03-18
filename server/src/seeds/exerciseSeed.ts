import { Exercise } from '../models/index.js';
import axios from 'axios';
import dotenv from 'dotenv';
import db from '../config/connection.js';

dotenv.config();

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL as string;
const X_API_KEY = process.env.X_API_KEY as string;

if (!EXTERNAL_API_URL || !X_API_KEY) {
    console.error('Missing environment variables. Please check your .env file');
    process.exit(1);
}

const seedMuscleDatabase = async (userMuscle: string): Promise<void> => {
    try {
        console.log(`Seeding exercises internal for muscle: ${userMuscle}`);
        // Fetch exercises from external API
        const { data } = await axios.get(EXTERNAL_API_URL, {
            headers: { 'X-Api-Key': X_API_KEY },
            params: { muscle: userMuscle } // Adjust limit as needed
        });
        console.log(data.length);
        console.log(`Fetched ${data.length} exercises for muscle: ${userMuscle}`);

        for (const ex of data) {
            console.log(`Processing exercise: ${ex.name}`);

            // Check if the exercise already exists
            const existingExercise = await Exercise.findOne({ name: ex.name });
            if (existingExercise) {
                console.log(`Skipping ${ex.name} as it already exists.`);
                continue;
            }

            // Create new exercise entry if not exists
            const newExercise = new Exercise({
                name: ex.name,
                type: ex.type,
                muscle: ex.muscle,
                equipment: ex.equipment,
                difficulty: ex.difficulty,
                instructions: ex.instructions
            });

            await newExercise.save();
            console.log(`Inserted exercise: ${ex.name}`);
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

const seedTypeDatabase = async (userType: string): Promise<void> => {
    try {
        console.log(`Seeding exercises internal for type: ${userType}`);
        // Fetch exercises from external API
        const { data } = await axios.get(EXTERNAL_API_URL, {
            headers: { 'X-Api-Key': X_API_KEY },
            params: { muscle: userType } // Adjust limit as needed
        });

        console
        console.log(`Fetched ${data.length} exercises for type: ${userType}`);
        for (const ex of data) {
            console.log(`Processing exercise: ${ex.name}`);

            // Check if the exercise already exists
            const existingExercise = await Exercise.findOne({ name: ex.name });
            if (existingExercise) {
                console.log(`Skipping ${ex.name} as it already exists.`);
                continue;
            }

            // Create new exercise entry if not exists
            const newExercise = new Exercise({
                name: ex.name,
                type: ex.type,
                muscle: ex.muscle,
                equipment: ex.equipment,
                difficulty: ex.difficulty,
                instructions: ex.instructions
            });

            await newExercise.save();
            console.log(`Inserted exercise: ${ex.name}`);
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

const seedDatabase = async (): Promise<void> => {

    try{
        await db(); // Ensure the database connection is established
        
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }

    try {
        const muscles = ["abdominals", "abductors", "adductors", "biceps", "calves", "chest", "forearms", "glutes", "hamstrings", "lats", "lower_back", "middle_back", "neck", "quadriceps", "traps", "triceps"];
        for (const muscle of muscles) {
            console.log(`Seeding muscle: ${muscle}`);
            await seedMuscleDatabase(muscle);
        }
        const types = ['cardio',
            'olympic_weightlifting',
            'plyometrics',
            'powerlifting',
            'strength',
            'stretching',
            'strongman'];

        for (const type of types) {
            console.log(`Seeding type: ${type}`);
            await seedTypeDatabase(type);
        }
        console.log('Seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();

export { seedMuscleDatabase, seedTypeDatabase };

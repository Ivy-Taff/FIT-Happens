import { User } from '../models/index.js';
import Exercise from '../models/exercise.js';
import Workout from '../models/Workout.js';
import axios from "axios";
import { signToken, AuthenticationError } from '../utils/auth.js'; 

import dotenv from "dotenv";

dotenv.config();

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL as string;
const X_API_KEY = process.env.X_API_KEY as string;

// Define types for the arguments
interface AddUserArgs {
  input:{
    username: string;
    email: string;
    password: string;
  }
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface UserArgs {
  username: string;
}

interface CreateWorkoutArgs {
  name: string;
  userId: string;
  exerciseIds: string[];
}

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('thoughts');
    },
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username }).populate('thoughts');
    },

    // Query to get the authenticated user's information
    // The 'me' query relies on the context to check if the user is authenticated
    me: async (_parent: any, _args: any, context: any) => {
      // If the user is authenticated, find and return the user's information along with their thoughts
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('thoughts');
      }
      // If the user is not authenticated, throw an AuthenticationError
      throw new AuthenticationError('Could not authenticate user.');
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      // Create a new user with the provided username, email, and password
      const user = await User.create({ ...input });
    
      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);
    
      // Return the token and the user
      return { token, user };
    },
    
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      // Find a user with the provided email
      const user = await User.findOne({ email });
    
      // If no user is found, throw an AuthenticationError
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);
    
      // If the password is incorrect, throw an AuthenticationError
      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);
    
      // Return the token and the user
      return { token, user };
    }
  },

  fetchAndStoreExercises: async () => {
    try {
      const { data } = await axios.get(EXTERNAL_API_URL, {
        headers: { "X_API_KEY" : X_API_KEY }
      });

      const savedExercises = [];

      for (const ex of data.exercises) {
        let existingExercise = await Exercise.findOne({ _id: ex._id });

        if (!existingExercise) {
          const newExercise = new Exercise({
            _id: ex._id,
            name: ex.name,
            type: ex.type,
            muscle: ex.muscle,
            equipment: ex.equipment,
            difficulty: ex.difficulty,
            instructions: ex.instructions,
          });
          savedExercises.push(await newExercise.save());
        }
      }
      return savedExercises;
    } catch (error) {
      throw new Error("Error fetching exercises");
    }
  },

  createWorkout: async (_: unknown, { name, userId, exerciseIds }: CreateWorkoutArgs
  ) => {
    const workout = new Workout({
      name,
      userId,
      exercises: exerciseIds,
      currentDate: new Date(),
    });
    return await workout.save();
  },
};

export default resolvers;

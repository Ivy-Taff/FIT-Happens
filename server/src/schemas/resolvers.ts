
import axios from "axios";
import { User, Workout, Exercise } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';


import dotenv from "dotenv";

dotenv.config();

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL as string;
const X_API_KEY = process.env.X_API_KEY as string;

// Define types for the arguments
interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
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

interface AddExerciseArgs {
  input: {
    name: string;
    type: string;
    muscle: string;
    equipment?: string;
    difficulty?: string;
    instructions?: string;
  };
}

interface AddWorkoutArgs {
  input: {
    exercise: string[];
    currentDate: string;
  };
}

interface ExerciseArgs {
  id: string;
}

interface WorkoutArgs {
  id: string;

}

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('workouts');
    },
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username }).populate('workouts');
    },
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('workouts');
      }
      throw new AuthenticationError('Could not authenticate user.');
    },


    // Query to get saved exercises
    getSavedExercises: async () => {
      return await Exercise.find();
    },

    // Query to get user workouts
    getUserWorkouts: async (_: unknown, { userId }: { userId: string }) => {
      return await Workout.find({userId}).populate("exercises");},

    exercises: async () => {
      return Exercise.find();
    },
    exercise: async (_parent: any, { id }: ExerciseArgs) => {
      return Exercise.findById(id);
    },
    workouts: async () => {
      return Workout.find().populate('exercise');
    },
    workout: async (_parent: any, { id }: WorkoutArgs) => {
      return Workout.findById(id).populate('exercise');

    },
  },

  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
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
    

    addExercise: async (_parent: any, { input }: AddExerciseArgs) => {
      return Exercise.create({ ...input });
    },
    
    addWorkout: async (_parent: any, { input }: AddWorkoutArgs) => {
      return Workout.create({ ...input });
    }
  
  },

  createWorkout: async (_: unknown, { name, userId, exerciseIds }: CreateWorkoutArgs
  ) => {
    const workout = new Workout({
      name,
      userId,
      exercises: exerciseIds,
      createdAt: new Date(),
    });
    return await workout.save();
  },

  updateWorkout: async (_: unknown, { workoutId, name, exerciseIds }: {workoutId: string; name: string; exerciseIds: []}) => {
    try {
      // Find the workout by its ID
      const workout = await Workout.findById(workoutId);

      if (!workout) {
        throw new Error("Workout not found");
      }

      // Update the workout's name and exercises
      workout.name = name;
      workout.exercises = exerciseIds;

      // Save the updated workout
      const updatedWorkout = await workout.save();

      return updatedWorkout;
    } catch (error) {
      console.error(error);
      throw new Error("Error updating workout");
    }
  },

  removeExerciseFromWorkout: async (_: unknown, { workoutId, exerciseId }: { workoutId: string; exerciseId: string }
  ) => {
    const updatedWorkout = await Workout.findByIdAndUpdate(
      workoutId,
      { $pull: { exercises: exerciseId } }, // Removes exerciseId from exercises array
      { new: true }
    ).populate("exercises"); // Return updated workout with exercises

    if (!updatedWorkout) {
      throw new Error("Workout not found");
    }

    return updatedWorkout;
  },
};


export default resolvers;
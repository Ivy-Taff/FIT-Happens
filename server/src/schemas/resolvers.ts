
import { User, Workout, Exercise } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';


import dotenv from "dotenv";

dotenv.config();

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
  userId: string;
}


interface CreateWorkoutArgs {
  name: string;
  userId: string;
  exerciseIds: string[];
}

interface UserContext {
  user: {
    _id: string;
  };
}

interface AddExerciseArgs {
  input: {
    name: string;
    type: string;
    muscle: string;
    equipment?: string;
    difficulty?: string;
    instructions?: string;
  }
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
    user: async (_parent: any, { userId }: UserArgs) => {
      return User.findOne({ userId }).populate('workouts');
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
    getUserWorkouts: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id }).populate('workouts').populate({
          path: "workouts", 
          populate: "exercises",
        });
      }
      throw new AuthenticationError('Could not authenticate user.');
    },

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

    addExercise: async (_parent: any, { input }: AddExerciseArgs) => {
      return Exercise.create({ ...input });
    },

    addWorkout: async (_parent: any, { input }: AddWorkoutArgs) => {
      return Workout.create({ ...input });
    },

    createWorkout: async (_: unknown, { name, exerciseIds }: CreateWorkoutArgs, context: UserContext
    ) => {
      const workout = new Workout({
        name,
        userId: context.user._id,
        exercises: exerciseIds,
        createdAt: new Date(),
      });
      await User.findOneAndUpdate({_id: context.user._id}, {$addToSet: {workouts: workout._id}}, {new: true})
      return await workout.save();
    },

    updateWorkout: async (_: unknown, { workoutId, name, exerciseIds }: { workoutId: string; name: string; exerciseIds: [] }) => {
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

    deleteWorkout: async (_: unknown, { id }: { id: string }) => {
      const deletedWorkout = await Workout.findByIdAndDelete(id);
      if (!deletedWorkout) {
        throw new Error("Workout not found");
      }
      return {
        _id: deletedWorkout._id,
        name: deletedWorkout.name,
      };
    },
  }
};


export default resolvers;
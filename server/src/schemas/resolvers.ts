import { User, Workout, Exercise } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

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
  },
};

export default resolvers;
import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($_id: ID!) {
    user(_id: $_id) {
      _id
      username
      email
      workouts {
        _id
        exercises
        currentDate
        # I am not sur if current date is appropriate here?
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      workouts {
        _id
        exercises
        currentDate
        # I am not sur if current date is appropriate here?
      }
    }
  }
`;

export const GET_SAVED_EXERCISES = gql`
  query GetSavedExercises {
    getSavedExercises {
      _id
      name
      type
      muscle
      equipment
      difficulty
      instructions
    }
  }
`;

export const GET_WORKOUT = gql`
  query GetWorkout($workoutId: ID!) {
    workout(_id: $workoutId) {
      _id
      name
      exercises {
        _id
        name
      }
    }
  }
`;

export const GET_USER_WORKOUTS = gql`
query GetUserWorkouts {
  getUserWorkouts {
    username
    email
    workouts {
      _id
      name
      exercises {
        _id
        name
      }
    }
  }
}
`;




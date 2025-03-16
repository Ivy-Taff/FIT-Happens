import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation Mutation($input: UserInput!) {
  addUser(input: $input) {
    user {
      username
      _id
    }
    token
  }
}
`;

export const CREATE_WORKOUT = gql`
  mutation CreateWorkout($name: String!, $userId: ID!, $exerciseIds: [ID!]!) {
    createWorkout(name: $name, userId: $userId, exerciseIds: $exerciseIds) {
      _id
      name
      username
    }
  }
`;

export const UPDATE_WORKOUT = gql`
  mutation UpdateWorkout($workoutId: ID!, $name: String!, $exerciseIds: [ID!]!) {
    updateWorkout(workoutId: $workoutId, name: $name, exerciseIds: $exerciseIds) {
      id
      name
      exercises {
        id
        name
      }
    }
  }
`;

export const REMOVE_EXERCISE_FROM_WORKOUT = gql`
  mutation RemoveExerciseFromWorkout($workoutId: ID!, $exerciseId: ID!) {
    removeExerciseFromWorkout(workoutId: $workoutId, exerciseId: $exerciseId) {
      id
      name
      exercises {
        id
        name
      }
    }
  }
`;
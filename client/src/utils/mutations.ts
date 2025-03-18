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
      email
      password
      _id
    }
    token
  }
}
`;

export const CREATE_WORKOUT = gql`
  mutation CreateWorkout($name: String!, $exerciseIds: [ID!]!) {
    createWorkout(name: $name, exerciseIds: $exerciseIds) {
      _id
      name
      exercises {
        _id
      }
      createdAt
    }
  }
`;

export const UPDATE_WORKOUT = gql`
  mutation UpdateWorkout($workoutId: ID!, $name: String!, $exerciseIds: [ID!]!) {
    updateWorkout(workoutId: $workoutId, name: $name, exerciseIds: $exerciseIds) {
      _id
      name
      exercises {
        _id
        name
      }
    }
  }
`;

export const REMOVE_EXERCISE_FROM_WORKOUT = gql`
  mutation RemoveExerciseFromWorkout($workoutId: ID!, $exerciseId: ID!) {
    removeExerciseFromWorkout(workoutId: $workoutId, exerciseId: $exerciseId) {
      _id
      name
      exercises {
        _id
        name
      }
    }
  }
`;
import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      workouts {[
        _id
        exercises
        currentDate
        # I am not sur if current date is appropriate here?
      ]}
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      workouts {[
        _id
        exercises
        currentDate
        # I am not sur if current date is appropriate here?
      ]}
    }
  }
`;

export const GET_EXERCISES = gql`
  query GetExercises {
    exercises {
      _id
      name
      type
      muscle
      equipment
      difficulty
      instructions
    }
  }`

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
      id
      name
    }
  }
`;
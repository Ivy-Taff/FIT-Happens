import gql from 'graphql-tag';

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  type Exercise {
    _id: ID!
    name: String!
    muscle: string
    equipment: String
    difficulty: String
    instructions: String
  }

  type Workout {
    id: ID!
    name: String!
    userId: ID!
    exercises: [Exercise]!
  }
  
  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    me: User
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    fetchAndStoreExercises: [Exercise]
    createWorkout(name: String!, userId: ID!, exerciseIds: [ID!]!): Workout
  }
`;

export default typeDefs;

import gql from 'graphql-tag';

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    workouts: [Workout]
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }
  
  type Auth {
    token: ID!
    user: User
  }

  type Exercise {
    _id: ID
    name: String
    type: String
    muscle: String
    equipment: String
    difficulty: String
    instructions: String
  }

  input ExerciseInput {
    name: String!
    type: String!
    muscle: String!
    equipment: String
    difficulty: String
    instructions: String
  }

  type Workout {
    _id: ID
    exercise: [Exercise]
    currentDate: String
  }

  input WorkoutInput {
    exercise: [ID]!
    currentDate: String!
  }

  type Query {
    users: [User]
    user(username: String!): User
    me: User
    exercises: [Exercise]
    exercise(id: ID!): Exercise
    workouts: [Workout]
    workout(id: ID!): Workout
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    addExercise(input: ExerciseInput!): Exercise
    addWorkout(input: WorkoutInput!): Workout
  }
`;

export default typeDefs;
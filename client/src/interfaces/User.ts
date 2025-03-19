import { Workout } from "./Workout"

export interface User {
    _id: string;          
    username: string;
    email: string;
    workouts: Workout[];   
    createdAt: string;    
    updatedAt: string;    
  }
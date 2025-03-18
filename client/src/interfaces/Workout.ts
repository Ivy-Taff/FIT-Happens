export interface Workout {
    _id: string;           
    name: string;
    userId: string;       
    exercises: string[];  
    createdAt: Date;
}
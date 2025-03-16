import { Schema, model, Document } from 'mongoose';

interface ExerciseDocument extends Document {
    name: string;
    type: string;
    muscle: string;
    equipment: string;
    difficulty: string;
    instructions: string;
}

const exerciseSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    muscle: { type: String, required: true },
    equipment: { type: String },
    difficulty: { type: String },
    instructions: { type: String }
});

const exercise = model<ExerciseDocument>('exercise', exerciseSchema);

export default exercise;
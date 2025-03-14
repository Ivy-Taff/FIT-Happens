import { Schema, model, Document } from 'mongoose';

interface Workout extends Document {
  exercise: Schema.Types.ObjectId[];
  currentDate: Date;
}

const workoutSchema = new Schema<Workout>({
  exercise: [{ type: Schema.Types.ObjectId, ref: 'exercise' }],
  currentDate: { type: Date, required: true }
});

const Workout = model<Workout>('Workout', workoutSchema);

export default Workout;
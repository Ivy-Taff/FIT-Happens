import { Schema, model, Document } from 'mongoose';

interface Workout extends Document {
  name: String;
  userId: Schema.Types.ObjectId,
  exercises: Schema.Types.ObjectId[];
  currentDate: Date;
}

const workoutSchema = new Schema<Workout>({
  name: String,
  userId: Schema.Types.ObjectId,
  exercises: [{ type: Schema.Types.ObjectId, ref: 'exercise' }],
  currentDate: { type: Date, required: true }
});

const Workout = model<Workout>('Workout', workoutSchema);

export default Workout;
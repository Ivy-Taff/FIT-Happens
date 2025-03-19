import { Schema, model, Document } from 'mongoose';

interface ExerciseArray {
  _typename: String;
  _id: String;
  name: String;
}

interface Workout extends Document {
  _id: String;
  name: String;
  userId: String,
  exercises: ExerciseArray[];
  createdAt: Date;
}

const workoutSchema = new Schema<Workout>({
  name: String,
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  exercises: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
  createdAt: { type: Date, default: Date.now },
});

const Workout = model<Workout>('Workout', workoutSchema);

export default Workout;
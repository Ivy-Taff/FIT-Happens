import { Schema, model, Document } from 'mongoose';

interface Workout extends Document {
  name: String;
  userId: Schema.Types.ObjectId,
  exercises: Schema.Types.ObjectId[];
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
import { useQuery, useMutation } from "@apollo/client";
import { GET_SAVED_EXERCISES } from "../utils/queries";
import { REMOVE_EXERCISE_FROM_WORKOUT } from "../utils/mutations";
import { CREATE_WORKOUT, UPDATE_WORKOUT } from "../utils/mutations";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Exercise } from "../interfaces/Exercise";

interface WorkoutCreatorProps {
    userId: string;
    closeForm: () => void;
}

const WorkoutCreator: React.FC<WorkoutCreatorProps> = ({ userId, closeForm }) => {
    const { workoutId } = useParams<{ workoutId: string }>();  // Get the workoutId from URL params
    const navigate = useNavigate();  // For redirecting after creating/updating
    const { loading, error, data } = useQuery(GET_SAVED_EXERCISES);
    const [createWorkout] = useMutation(CREATE_WORKOUT);
    const [updateWorkout] = useMutation(UPDATE_WORKOUT); // Mutation to update existing workout
    const [removeExercise] = useMutation(REMOVE_EXERCISE_FROM_WORKOUT);
  
    const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
    const [workoutName, setWorkoutName] = useState("");
    
    useEffect(() => {
        if (workoutId) {
          // Fetch the workout data based on workoutId
          // GET_WORKOUT query should return workout data
          const workout = data?.workout;
          if (workout) {
            setWorkoutName(workout.name);
            setSelectedExercises(workout.exercises.map((ex: Exercise) => ex._id)); // Set selected exercises
          }
        }
      }, [workoutId, data]);

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p>Error loading exercises</p>;

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleRemoveExercise = async (exerciseId: string) => {
    setSelectedExercises((prev) => prev.filter((id) => id !== exerciseId)); // Remove from list
    
    // This is calling the removeExercise mutation
    if (workoutId) {
        try {
          await removeExercise({
            variables: {
              workoutId: workoutId, // Pass the workoutId
              exerciseId: exerciseId,
            },
          });
          console.log("Exercise removed successfully.");
        } catch (error) {
          console.error("Error removing exercise:", error);
        }
      }
    };

  const handleSubmitWorkout = async (event: React.FormEvent) => {
    event?.preventDefault();
    try {
        if (workoutId) {
          // Update workout if editing an existing one
          const { data } = await updateWorkout({
            variables: {
              workoutId: workoutId,
              name: workoutName,
              exerciseIds: selectedExercises,
            },
          });
          console.log("Workout updated:", data.updateWorkout);
        } else {
          // Create workout if new
          const { data } = await createWorkout({
            variables: {
              name: workoutName,
              userId,
              exerciseIds: selectedExercises,
            },
          });
          console.log("Workout created:", data.createWorkout);
        }
        navigate("/workouts"); // Redirect after creation or update
      } catch (error) {
        console.error("Error saving workout:", error);
      }
      closeForm();
    };

    return (
        <div>
          <h2>{workoutId ? "Edit Workout" : "Create a Workout"}</h2>
          <input
            type="text"
            placeholder="Workout Name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
          />
    
          <h3>Available Exercises</h3>
          <ul>
            {data.getSavedExercises.map((exercise: Exercise) => (
              <li key={exercise._id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedExercises.includes(exercise._id)}
                    onChange={() => handleExerciseSelect(exercise._id)}
                  />
                  {exercise.name}
                </label>
              </li>
            ))}
          </ul>
    
          <h3>Selected Exercises</h3>
          <ul>
            {selectedExercises.map((exerciseId) => {
              const exercise = data.getSavedExercises.find(
                (ex: Exercise) => ex._id === exerciseId
              );
              return (
                <li key={exerciseId}>
                  {exercise?.name}
                  <button onClick={() => handleRemoveExercise(exerciseId)}>
                    ❌
                  </button>
                </li>
              );
            })}
          </ul>
    
          <button onClick={handleSubmitWorkout}>
            {workoutId ? "Update Workout" : "Create Workout"}
          </button>
        </div>
      );
    };


export default WorkoutCreator;
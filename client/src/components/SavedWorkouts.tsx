import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_WORKOUTS } from "../utils/queries";
import { DELETE_WORKOUT, REMOVE_EXERCISE_FROM_WORKOUT } from "../utils/mutations";
import { useState } from "react";
import { User } from "../interfaces/User"



interface GetUserWorkoutsData {
    getUserWorkouts: User;
}

const SavedWorkouts: React.FC = () => {
    const { loading, error, data, refetch } = useQuery<GetUserWorkoutsData>(GET_USER_WORKOUTS);
    const [deleteWorkout] = useMutation(DELETE_WORKOUT);
    const [removeExercise] = useMutation(REMOVE_EXERCISE_FROM_WORKOUT);
    const [successMessage, setSuccessMessage] = useState("");

    if (loading) return <p>Loading workouts...</p>;
    if (error) return <p>Error loading workouts</p>;
    const handleDeleteWorkout = async (workoutId: string) => {
        try {
            await deleteWorkout({ variables: { workoutId } });
            setSuccessMessage("Workout deleted successfully!");
            refetch();
        } catch (error) {
            console.error("Error deleting workout:", error);
        }
    };

    const handleRemoveExercise = async (workoutId: string, exerciseId: string) => {
        try {
            await removeExercise({ variables: { workoutId, exerciseId } });
            setSuccessMessage("Exercise removed successfully!");
            refetch();
        } catch (error) {
            console.error("Error removing exercise:", error);
        }
    };

    return (
        <section>
            <h2>Saved Workouts</h2>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {data?.getUserWorkouts.workouts.length === 0 ? (
                <p>No workouts saved yet.</p>
            ) : (
                <ul>
                    {data?.getUserWorkouts.workouts.map((workout) => (
                        <li key={workout._id}>
                            <h3>{workout.name}</h3>
                            <ul>
                                {workout.exercises.map((exercise: any) => (
                                    <li key={exercise._id}>
                                        {exercise.name}
                                        <button onClick={() => handleRemoveExercise(workout._id, exercise._id)}>❌</button>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handleDeleteWorkout(workout._id)}>Delete Workout</button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default SavedWorkouts;

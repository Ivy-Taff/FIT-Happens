import { useQuery, useMutation } from "@apollo/client";
import { GET_SAVED_EXERCISES } from "../utils/queries";
import { REMOVE_EXERCISE_FROM_WORKOUT } from "../utils/mutations";
import { CREATE_WORKOUT, UPDATE_WORKOUT } from "../utils/mutations";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Exercise } from "../interfaces/Exercise";


const WorkoutCreator = () => {
    const { workoutId } = useParams<{ workoutId: string }>();  // Get the workoutId from URL params
    // const navigate = useNavigate();  // For redirecting after creating/updating
    const { loading, error, data } = useQuery(GET_SAVED_EXERCISES);
    const [createWorkout] = useMutation(CREATE_WORKOUT);
    const [updateWorkout] = useMutation(UPDATE_WORKOUT); // Mutation to update existing workout
    const [removeExercise] = useMutation(REMOVE_EXERCISE_FROM_WORKOUT);
  
    const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
    const [workoutName, setWorkoutName] = useState("");
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState("");
 
    
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

  // if (!showForm) return null;
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
    if (!workoutName.trim()) {
      setErrorMessage("Please enter a workout name.");
      return;
  }
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
              exerciseIds: selectedExercises,
            },
          });
          console.log("Workout created:", data.createWorkout);
        }
        setSuccessMessage("Workout saved successfully!");
        setErrorMessage("");
        setWorkoutName("");
        setSelectedExercises([]);

// This will make the success message go away
        setTimeout(() => {
          setSuccessMessage("");
      }, 3000);

      } catch (error) {
        console.error("Error saving workout:", error);
      }
    };

    return (
        <section
          style={{
            textAlign: 'center', // Center the entire section
            marginBottom: '20px', // Add spacing below the section
          }}
        >
          {/* Centered and Styled Title */}
          <h2
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: '2rem',
              color: '#fff',
              marginBottom: '20px', // Add spacing below the title
            }}
          >
            {workoutId ? 'Edit Workout' : 'Create a Workout'}
          </h2>
    
          {/* Styled Input for Workout Name */}
          <input
            type="text"
            placeholder="Workout Name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            style={{
              width: '80%', // Make the input wider
              maxWidth: '400px', // Limit the maximum width
              padding: '10px', // Add padding inside the input
              fontSize: '1rem', // Adjust font size
              borderRadius: '5px', // Rounded corners
              border: '1px solid #ccc', // Subtle border
              marginBottom: '20px', // Add spacing below the input
              textAlign: 'center', // Center the placeholder and text
              display: 'block', // Ensure the input is centered
              margin: '0 auto 20px auto', // Center horizontally and add spacing below
            }}
          />
    
          <h3 style={{ fontFamily: 'Roboto, sans-serif', color: '#fff', marginBottom: '10px' }}>
            Available Exercises
          </h3>
          <ul
            style={{
              listStyleType: 'none', // Remove default bullet points
              padding: '0', // Remove default padding
              margin: '0', // Remove default margin
              backgroundColor: '#1a1a1a', // Dark background
              borderRadius: '5px', // Rounded corners
              maxHeight: '300px', // Limit height
              overflowY: 'auto', // Add scroll if content exceeds height
              padding: '10px', // Add padding inside the list
              border: '1px solid #333', // Add a subtle border
            }}
          >
            {data.getSavedExercises.map((exercise: Exercise) => (
              <li
                key={exercise._id}
                style={{
                  padding: '10px',
                  marginBottom: '10px',
                  borderBottom: '1px solid #555', // Add a subtle divider
                  color: 'white', // White text
                  fontFamily: 'Roboto, sans-serif', // Custom font
                  fontSize: '1rem', // Adjust font size
                  display: 'flex', // Align checkbox and text
                  alignItems: 'center', // Center align items
                  justifyContent: 'space-between', // Space between checkbox and text
                  transition: 'background-color 0.3s ease', // Smooth hover effect
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333')} // Darker background on hover
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')} // Reset background on mouse leave
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={selectedExercises.includes(exercise._id)}
                    onChange={() => handleExerciseSelect(exercise._id)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                    }}
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
    
          <button
            onClick={handleSubmitWorkout}
            style={{
              display: 'block', // Make the button a block element
              margin: '20px auto', // Center the button horizontally
              padding: '10px 20px', // Add padding inside the button
              fontSize: '1rem', // Adjust font size
              fontWeight: 'bold', // Make the text bold
              color: '#fff', // White text
              backgroundColor: '#007bff', // Blue background
              border: 'none', // Remove default border
              borderRadius: '5px', // Rounded corners
              cursor: 'pointer', // Change cursor to pointer on hover
              transition: 'background-color 0.3s ease, transform 0.3s ease', // Smooth hover effect
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0056b3'; // Darker blue on hover
              e.currentTarget.style.transform = 'scale(1.05)'; // Slightly enlarge on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#007bff'; // Reset background color
              e.currentTarget.style.transform = 'scale(1)'; // Reset scale
            }}
          >
            {workoutId ? 'Update Workout' : 'Create Workout'}
          </button>
          <section>
            {successMessage && <p className="success-message">{successMessage}</p>} 
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </section>
        </section>
      );
    };


export default WorkoutCreator;
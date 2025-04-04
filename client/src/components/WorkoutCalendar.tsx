import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_WORKOUTS } from "../utils/queries";
import { Workout } from "../interfaces/Workout"; // Make sure you have this model defined
import { User } from "../interfaces/User"; // Make sure you have this model defined
import "../assets/WorkoutCalendar.css";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface GetUserWorkoutsData {
  getUserWorkouts: User;
}

const WorkoutCalendar: React.FC = () => {
  const { loading, error, data } = useQuery<GetUserWorkoutsData>(GET_USER_WORKOUTS);

  // State to track workouts assigned to each day
  const [schedule, setSchedule] = useState<{ [day: string]: Workout[] }>({});

  // Initialize the schedule with empty arrays for each day
  useEffect(() => {
    const savedSchedule = localStorage.getItem("workoutSchedule");
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
    } else {
      const initialSchedule: { [day: string]: Workout[] } = {};
      daysOfWeek.forEach((day) => {
        initialSchedule[day] = [];
      });
      setSchedule(initialSchedule);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("workoutSchedule", JSON.stringify(schedule));
  }, [schedule]);

  if (loading) return <p>Loading workouts...</p>;
  if (error) return <p>Error loading workouts</p>;

  // Returns an array of workouts in data.GetUserWorkouts
  const workouts: Workout[] = data?.getUserWorkouts.workouts || [];

  // When a drag starts, store the workout's ID in the drag event's object.
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, workout: Workout) => {
    event.dataTransfer.setData("workoutId", workout._id);
  };

  // Allow drop by preventing the default behavior.
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // On drop, retrieve the workout ID and add the corresponding workout to the day's schedule.
  const handleDrop = (event: React.DragEvent<HTMLDivElement>, day: string) => {
    event.preventDefault();
    const workoutId = event.dataTransfer.getData("workoutId");
    const workout = workouts.find((w) => w._id === workoutId);
    if (workout) {
      setSchedule((prevSchedule) => {
        const dayWorkouts = prevSchedule[day] || [];
        // Optionally prevent duplicates by checking if the workout is already in the day
        if (!dayWorkouts.find((w) => w._id === workout._id)) {
          return {
            ...prevSchedule,
            [day]: [...dayWorkouts, workout],
          };
        }
        return prevSchedule;
      });
    }
  };

  // Remove a workout from a specific day
  const removeWorkoutFromDay = (day: string, workoutId: string) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: prevSchedule[day].filter((w) => w._id !== workoutId),
    }));
  };

  return (
    <div className="workout-calendar">
      <h2>Workout Calendar</h2>

      {/* Render the calendar with day slots */}
      <div
        className="calendar-container"
        style={{
          display: "flex",
          backgroundColor: "white",
          flexWrap: "wrap", // Allow wrapping for mobile responsiveness
          gap: "10px", // Add spacing between day slots
          padding: "10px", // Add padding to the container
        }}
      >
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="day-slot"
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, day)}
            style={{
              flex: "1 1 200px", // Flex grow, shrink, and base width
              border: "2px solid black", // Black border
              borderRadius: "8px", // Rounded corners
              padding: "10px", // Inner padding
              minHeight: "150px", // Minimum height for each day slot
              backgroundColor: "#f9f9f9", // Light background for contrast
            }}
          >
            <h3>{day}</h3>
            {schedule[day] &&
              schedule[day].map((workout) => (
                <div
                  key={workout._id}
                  className="workout-card"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "5px",
                    margin: "5px 0",
                    backgroundColor: "#fff",
                  }}
                >
                  <p>{workout.name}</p>
                  <button
                    onClick={() => removeWorkoutFromDay(day, workout._id)}
                    style={{
                      backgroundColor: "#ff4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* List of available workouts */}
      <h3>Available Workouts</h3>
      <div
        className="workout-list"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px", // Add spacing between workout cards
          padding: "10px", // Add padding to the container
        }}
      >
        {workouts.map((workout) => (
          <div
            key={workout._id}
            className="workout-card"
            draggable
            onDragStart={(event) => handleDragStart(event, workout)}
            style={{
              border: "1px solid #000",
              borderRadius: "8px",
              padding: "10px",
              width: "150px",
              cursor: "grab",
              backgroundColor: "#e0e0e0",
            }}
          >
            <p>{workout.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutCalendar;
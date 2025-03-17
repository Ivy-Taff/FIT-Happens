import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_WORKOUTS } from "../utils/queries";
import { Workout } from "../interfaces/Workout"; // Make sure you have this model defined


const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const WorkoutCalendar: React.FC = () => {
  const { loading, error, data } = useQuery(GET_USER_WORKOUTS);
  
  // State to track workouts assigned to each day
  const [schedule, setSchedule] = useState<{ [day: string]: Workout[] }>({});

  // Initialize the schedule with empty arrays for each day
  useEffect(() => {
    const initialSchedule: { [day: string]: Workout[] } = {};
    daysOfWeek.forEach((day) => {
      initialSchedule[day] = [];
    });
    setSchedule(initialSchedule);
  }, []);

  if (loading) return <p>Loading workouts...</p>;
  if (error) return <p>Error loading workouts</p>;

  // Assume that the query returns an array of workouts in data.getSavedWorkouts
  const workouts: Workout[] = data.getSavedWorkouts;

  // When a drag starts, we store the workout's ID in the drag event's dataTransfer object.
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
      <div className="calendar-container" style={{ display: "flex" }}>
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="day-slot"
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, day)}
            style={{
              flex: 1,
              border: "1px solid #ccc",
              margin: "5px",
              padding: "5px",
              minHeight: "200px",
            }}
          >
            <h3>{day}</h3>
            {schedule[day] &&
              schedule[day].map((workout) => (
                <div
                  key={workout._id}
                  className="workout-card"
                  style={{
                    border: "1px solid #000",
                    margin: "5px 0",
                    padding: "5px",
                    background: "#f9f9f9",
                  }}
                >
                  <p>{workout.name}</p>
                  <button onClick={() => removeWorkoutFromDay(day, workout._id)}>
                    Remove
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* List of available workouts that are draggable */}
      <h3>Available Workouts</h3>
      <div className="workout-list" style={{ display: "flex", flexWrap: "wrap" }}>
        {workouts.map((workout) => (
          <div
            key={workout._id}
            className="workout-card"
            draggable
            onDragStart={(event) => handleDragStart(event, workout)}
            style={{
              border: "1px solid #000",
              margin: "5px",
              padding: "5px",
              width: "150px",
              cursor: "grab",
              background: "#e0e0e0",
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
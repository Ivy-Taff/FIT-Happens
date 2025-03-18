<<<<<<< HEAD

import { useState } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> c84cdd32a6073eed2f3dea0a6b1a1a5f0cbaca8c
import { useQuery } from '@apollo/client';
import { Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import { GET_SAVED_EXERCISES } from '../utils/queries';
import CreateWorkout from '../components/WorkoutCreator';
import { Exercise } from '../interfaces/Exercise';

// Update interface field to match query response key
interface SavedExercisesData {
  getSavedExercises: Exercise[];
}

// not sure how userId is coming in on signup, this is assuming we are saving them in local
const storedUserId = localStorage.getItem('userId') || '';

// Default fallback values based on your provided sample response
const defaultTypes = ['strongman'];
const defaultMuscleGroups = ['forearms'];
const defaultEquipments = ['other'];
const defaultDifficulties = ['beginner'];

const ExerciseList: React.FC = () => {
  const { loading, error, data } = useQuery<SavedExercisesData>(GET_SAVED_EXERCISES);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedMusclegroup, setSelectedMusclegroup] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  // For debugging: store computed options in state
  const [types, setTypes] = useState<string[]>(defaultTypes);
  const [muscleGroups, setMuscleGroups] = useState<string[]>(defaultMuscleGroups);
  const [equipments, setEquipments] = useState<string[]>(defaultEquipments);
  const [difficulties, setDifficulties] = useState<string[]>(defaultDifficulties);

  const handleShowForm = () => setShowForm(true);

  // Log the raw data outside useEffect to see if it exists
  console.log('Raw fetched data:', data?.getSavedExercises);

  useEffect(() => {
    if (data && data.getSavedExercises) {
      console.log('useEffect triggered with data:', data);
      const exercises: Exercise[] = data.getSavedExercises;

      // Helper to extract unique non-empty string values
      const getUniqueValues = (key: keyof Exercise): string[] => {
        return Array.from(
          new Set(
            exercises
              .map((exercise) => (exercise[key] as unknown) as string)
              .filter((value) => value && value.trim() !== '')
          )
        );
      };

      const newTypes = getUniqueValues('type');
      const newMuscleGroups = getUniqueValues('muscle');
      const newEquipments = getUniqueValues('equipment');
      const newDifficulties = getUniqueValues('difficulty');

      // Log the computed values for debugging
      console.log('Computed Types:', newTypes);
      console.log('Computed Muscle Groups:', newMuscleGroups);
      console.log('Computed Equipments:', newEquipments);
      console.log('Computed Difficulties:', newDifficulties);

      setTypes(newTypes.length ? newTypes : defaultTypes);
      setMuscleGroups(newMuscleGroups.length ? newMuscleGroups : defaultMuscleGroups);
      setEquipments(newEquipments.length ? newEquipments : defaultEquipments);
      setDifficulties(newDifficulties.length ? newDifficulties : defaultDifficulties);
    }
  }, [data]);

  if (error) return <h2>Error fetching exercises: {error.message}</h2>;
  if (loading) return <h2>LOADING...</h2>;

  const exercises: Exercise[] = data?.getSavedExercises || [];

  const filteredExercisesList = exercises.filter((exercise) => {
    return (
      (!selectedType || exercise.type === selectedType) &&
      (!selectedMusclegroup || exercise.muscle === selectedMusclegroup) &&
      (!selectedEquipment || exercise.equipment === selectedEquipment) &&
      (!selectedDifficulty || exercise.difficulty === selectedDifficulty)
    );
  });

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing available exercises</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {filteredExercisesList.length
            ? `Viewing ${filteredExercisesList.length} saved ${filteredExercisesList.length === 1 ? 'exercise' : 'exercises'}:`
            : 'No exercises match your filters!'}
        </h2>

        {/* Filters for sorting the cards */}
        <Row className='mb-4'>
          <Col md={3}>
            <Form.Select onChange={(e) => setSelectedType(e.target.value)} value={selectedType}>
              <option value=''>All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {(() => {
                    const formatted = type.replace(/_/g, ' ');
                    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
                  })()}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              onChange={(e) => setSelectedMusclegroup(e.target.value)}
              value={selectedMusclegroup}
            >
              <option value=''>All Muscle Groups</option>
              {muscleGroups.map((musclegroup) => (
                <option key={musclegroup} value={musclegroup}>
                  {(() => {
                    const formatted = musclegroup.replace(/_/g, ' ');
                    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
                  })()}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select onChange={(e) => setSelectedEquipment(e.target.value)} value={selectedEquipment}>
              <option value=''>All Equipment</option>
              {equipments.map((equipment) => (
                <option key={equipment} value={equipment}>
                  {(() => {
                    const formatted = equipment.replace(/_/g, ' ');
                    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
                  })()}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select onChange={(e) => setSelectedDifficulty(e.target.value)} value={selectedDifficulty}>
              <option value=''>All Difficulties</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {(() => {
                    const formatted = difficulty.replace(/_/g, ' ');
                    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
                  })()}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Row>
          {/* Exercise card layout */}
          {filteredExercisesList.map((exercise) => (
            <Col md='4' key={exercise._id}>
              <Card border='dark'>
                <Card.Body>
                  <Card.Title>{exercise.name}</Card.Title>
                  <p className='small'>
                    {exercise.type} for {exercise.muscle}
                  </p>
                  <Card.Text>Difficulty: {exercise.difficulty}</Card.Text>
                  <Card.Text>Equipment needed: {exercise.equipment}</Card.Text>
                  <Card.Text>Instructions: {exercise.instructions}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Button to open the WorkoutCreator */}
        <Button variant='primary' onClick={handleShowForm}>
          Create Workout
        </Button>

        {showForm && (
          <div className='mt-5'>
            <CreateWorkout userId={storedUserId} />
          </div>
        )}
      </Container>
    </>
  );
};

export default ExerciseList;

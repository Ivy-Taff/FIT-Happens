
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import { GET_SAVED_EXERCISES } from '../utils/queries';
import CreateWorkout from '../components/WorkoutCreator';
import { Exercise } from '../models/Exercise';
import '../styles/styles.css';

interface SavedExercisesData {
  ExerciseList: Exercise[];
}

// not sure how userId is coming in on signup, this is assuming we are saving them in local
const storedUserId = localStorage.getItem('userId') || '';

const ExerciseList: React.FC = () => {
  // This retrieves the exercises we've save in our DB
  const { loading, error, data } = useQuery<SavedExercisesData>(GET_SAVED_EXERCISES);
  // This is to open the workout creator
  const [showForm, setShowForm] = useState<boolean>(false);
  // These are to select which cards to see based on selections
  const [selectedType, setSelectedType] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  
  const handleShowForm = () => setShowForm(true);
  const handleHideForm = () => setShowForm(false);

  // Check for loading or error states
  if (error) return <h2>Error fetching exercises: {error.message}</h2>;

  
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  const exercises: Exercise[] = data?.ExerciseList || [];

  const uniqueValuesFromExercises = (key: keyof Exercise) => [
    ...new Set(exercises.map((exercise) => exercise[key]).filter(Boolean)),
  ];

  const filteredExercisesList = exercises.filter((exercise) => {
    return (
      (!selectedType || exercise.type === selectedType) &&
      (!selectedMuscle || exercise.muscle === selectedMuscle) &&
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
            ? `Viewing ${filteredExercisesList.length} saved ${
                filteredExercisesList.length === 1 ? 'exercise' : 'exercises'
              }:`
            : 'No exercises match your filters!'}
        </h2>

        {/* Filters for sorting the cards */}
        <Row className='mb-4'>
          <Col md={3}>
            <Form.Select onChange={(e) => setSelectedType(e.target.value)} value={selectedType}>
              <option value=''>All Types</option>
              {uniqueValuesFromExercises('type').map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select onChange={(e) => setSelectedMuscle(e.target.value)} value={selectedMuscle}>
              <option value=''>All Muscles</option>
              {uniqueValuesFromExercises('muscle').map((muscle) => (
                <option key={muscle} value={muscle}>
                  {muscle}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select onChange={(e) => setSelectedEquipment(e.target.value)} value={selectedEquipment}>
              <option value=''>All Equipment</option>
              {uniqueValuesFromExercises('equipment').map((equipment) => (
                <option key={equipment} value={equipment}>
                  {equipment}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select onChange={(e) => setSelectedDifficulty(e.target.value)} value={selectedDifficulty}>
              <option value=''>All Difficulties</option>
              {uniqueValuesFromExercises('difficulty').map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Row>
          {/* This is our exercise card layout */}
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

          {/* This is a button to open the WorkoutCreator, any other ideas??? */}
        <Button variant='primary' onClick={handleShowForm}>
          Create Workout
        </Button>

        {showForm && (
          <div className='mt-5'>
            <CreateWorkout userId={storedUserId} closeForm={handleHideForm} />
          </div>
        )}
      </Container>
    </>
  );
};

export default ExerciseList;
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { GET_SAVED_EXERCISES } from '../utils/queries';
import CreateWorkout from '../components/WorkoutCreator'

const ExerciseList = () => {
  const { loading, error, data } = useQuery(GET_SAVED_EXERCISES);
  const [showForm, setShowForm] = useState(false);
  const handleShowForm = () => setShowForm(true);
  const handleHideForm = () => setShowForm(false);
  // Check for loading or error states
  if (error) return <h2>Error fetching exercises: {error.message}</h2>;

  
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  const userId = data?.userId || '';

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
            <h1>Viewing available exercises</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {data?.ExerciseList?.length
            ? `Viewing ${data.ExerciseList.length} saved ${
                data.ExerciseList.length === 1 ? 'exercise' : 'exercises'
              }:`
            : 'You have no saved exercises!'}
        </h2>
        <Row>
          {data?.ExerciseList?.map((exercise: { _id: string ; name: string | undefined; type: string | undefined; muscle: string | undefined; equipment: string | undefined; difficulty: string | undefined; instructions: string | undefined }) => {
            return (
              <Col md='4' key={exercise._id}>
                <Card key={exercise._id} border='dark'>
                  <Card.Body>
                    <Card.Title>{exercise.name}</Card.Title>
                    <p className='small'> {exercise?.type} for {exercise?.muscle} </p>
                    <Card.Text>Difficulty: {exercise?.difficulty}</Card.Text>
                    <Card.Text>Equipment needed: {exercise?.equipment}</Card.Text>
                    <Card.Text>Instructions: {exercise?.instructions}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
        <Button variant="primary" onClick={handleShowForm}>
          Create Workout
        </Button>

        {showForm && (
          <div className="mt-5">
            <CreateWorkout userId={userId} closeForm={handleHideForm} />
          </div>
        )}

      </Container>
    </>
  );
};

export default ExerciseList;

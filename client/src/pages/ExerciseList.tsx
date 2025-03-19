import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import { GET_SAVED_EXERCISES } from '../utils/queries';
import CreateWorkout from '../components/WorkoutCreator';
import { Exercise } from '../interfaces/Exercise';

// Update interface field to match query response key
interface SavedExercisesData {
  getSavedExercises: Exercise[];
}


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

  useEffect(() => {
    if (data && data.getSavedExercises) {
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

  // Inline styles for the container div
  const containerStyle = {
    backgroundColor: '#1a1a1a', 
    borderRadius: '5px', 
    padding: '20px', 
    margin: '20px auto', 
    color: 'white', 
    maxWidth: '1200px', 
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px', 
  };

  const buttonStyle = {
    transition: 'transform 0.3s ease, background-color 0.3s ease',
  };

  const titleStyle = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '1.5rem',
    marginTop: '20px',
    textAlign: 'left',
    color: '#fff', 
  };

  return (
    <>
      <div id="exercise-list-container" style={containerStyle}>
        <Container>
          {/* Centered Button */}
          <div style={buttonContainerStyle}>
            <Button
              style={buttonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              variant="primary"
              onClick={handleShowForm}
            >
              Create Workout
            </Button>
          </div>

          {showForm && (
            <div className="mt-5">
              <CreateWorkout />
            </div>
          )}

          <h2 style={titleStyle}>
            {filteredExercisesList.length
              ? `Viewing ${filteredExercisesList.length} ${
                  filteredExercisesList.length === 1 ? 'exercise' : 'exercises'
                }:`
              : 'No exercises match your filters!'}
          </h2>

          {/* Filters for sorting the cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Select onChange={(e) => setSelectedType(e.target.value)} value={selectedType}>
                <option value="">All Types</option>
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
                <option value="">All Muscle Groups</option>
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
                <option value="">All Equipment</option>
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
                <option value="">All Difficulties</option>
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
            {filteredExercisesList.map((exercise) => (
              <Col md="4" key={exercise._id}>
                <Card
                  style={{
                    backgroundColor: '#1a1a1a', // Dark background for the card
                    color: 'white', // White text for the entire card
                    borderRadius: '5px', // Rounded corners
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth hover effect
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  <Card.Body>
                    <Card.Title
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        textAlign: 'left',
                        color: 'white', // Ensure the title text is white
                      }}
                    >
                      {exercise.name}
                    </Card.Title>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        marginBottom: '10px',
                        textAlign: 'left',
                        color: 'white', // Ensure the text is white
                      }}
                    >
                      <strong>Type:</strong> {exercise.type}
                    </p>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        marginBottom: '10px',
                        textAlign: 'left',
                        color: 'white', // Ensure the text is white
                      }}
                    >
                      <strong>Muscle:</strong> {exercise.muscle}
                    </p>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        marginBottom: '10px',
                        textAlign: 'left',
                        color: 'white', // Ensure the text is white
                      }}
                    >
                      <strong>Equipment:</strong> {exercise.equipment}
                    </p>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        marginBottom: '10px',
                        textAlign: 'left',
                        color: 'white', // Ensure the text is white
                      }}
                    >
                      <strong>Difficulty:</strong> {exercise.difficulty}
                    </p>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        marginBottom: '10px',
                        textAlign: 'left',
                        color: 'white', // Ensure the text is white
                      }}
                    >
                      <strong>Instructions:</strong> {exercise.instructions}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ExerciseList;


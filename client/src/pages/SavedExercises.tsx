import { useQuery, useMutation } from '@apollo/client';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_EXERCISE } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeExerciseId } from '../utils/localStorage';
import type { Exercise } from '../models/Exercise';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';


const savedexercises = () => {
  const { loading, error, data } = useQuery(QUERY_ME);

  // Check for loading or error states
  if (error) return <h2>Error fetching user data: {error.message}</h2>;

  // Get the user data (including saved exercises)
  const userData = data?.me ? data.me: {};

  // create function that accepts the exercise's mongo _id value as param and deletes the exercise from the database
  const [ removeExercise ] = useMutation(REMOVE_EXERCISE, {
    update(cache, { data: { removeExercise } }) {
      cache.modify({
        fields: {
          me(existingUserData = {}) {
            return {
              ...existingUserData,
              savedExercises: existingUserData.savedExercises?.filter(
                (exercise: Exercise) => exercise._id !== removeExercise._id
              ) || [],
            };
          },
        },
      });
    },
  });

  const handleDeleteExercise = async (_id: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log(token);
    if (!token) {
      return false;
    }

    try {
      const { data } = await removeExercise({
       variables: { _id },
       });

       if (!data) {
        throw new Error('Something went wrong removing exercise!')
       }
       removeExerciseId(_id);
    } catch (err) {
      console.error(err);
    }
  };

  // // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

console.log(userData)
  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData?.username ? (
            <h1>Viewing {userData.username}'s saved exercises!</h1>
          ) : (
            <h1>Viewing saved exercises!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData?.savedExercises?.length
            ? `Viewing ${userData.savedExercises.length} saved ${
                userData.savedExercises.length === 1 ? 'exercise' : 'exercises'
              }:`
            : 'You have no saved exercises!'}
        </h2>
        <Row>
          {userData?.savedExercises?.map((exercise: { _id: string ; image: string | undefined; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; authors: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; description: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => {
            return (
              <Col md='4' key={exercise._id}>
                <Card key={exercise._id} border='dark'>
                  {exercise.image ? (
                    <Card.Img
                      src={exercise.image}
                      alt={`The cover for ${exercise.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{exercise.title}</Card.Title>
                    <p className='small'>Muscle: {exercise.muscle}</p>
                    <Card.Text>{exercise.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteExercise(exercise._id)}
                    >
                      Delete this Exercise!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default savedexercises;

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import { UserLogin } from '../interfaces/UserLogin';


const LoginForm = () => {
  const [userFormData, setUserFormData] = useState<UserLogin>({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [login] = useMutation(LOGIN_USER);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await login({
        variables: { email: userFormData.email, password: userFormData.password },
      });

      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      email: '',
      password: '',
    });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row>
        <Col>
          <Card className="p-4" style={{ width: '400px' }}>
            <Card.Body>
              <Card.Title className="text-center mb-4">Login</Card.Title>
              <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                <Alert
                  dismissible
                  onClose={() => setShowAlert(false)}
                  show={showAlert}
                  variant="danger"
                  className="mb-4"
                >
                  Something went wrong with your login credentials!
                </Alert>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    onChange={handleInputChange}
                    value={userFormData.email || ''}
                    required
                  />

                  <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleInputChange}
                    value={userFormData.password || ''}
                    required
                  />
                  <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>
                <Button
                  disabled={!(userFormData.email && userFormData.password)}
                  type="submit"
                  variant="primary"
                  className="w-100 mt-3"
                >
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
// const LoginForm = () => {
//  const [userFormData, setUserFormData] = useState<UserLogin>({  email: '', password: '' });
//  const [validated] = useState(false);
//  const [showAlert, setShowAlert] = useState(false);
//  const [login] = useMutation(LOGIN_USER);


//  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
//    const { name, value } = event.target;
//    setUserFormData({ ...userFormData, [name]: value });
//  };


//  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
//    event.preventDefault();


//    // check if form has everything (as per react-bootstrap docs)
//    const form = event.currentTarget;
//    if (form.checkValidity() === false) {
//      event.preventDefault();
//      event.stopPropagation();
//    }


//    try {
//      const { data } = await login({
//        variables: { email: userFormData.email, password: userFormData.password },
//      });


//      Auth.login(data.login.token);
//    } catch (err) {
//      console.error(err);
//      setShowAlert(true);
//    }


//    setUserFormData({
//      email: '',
//      password: '',
//    });
//  };


//  return (
//    <>
//      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
//        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
//          Something went wrong with your login credentials!
//        </Alert>
//        <Form.Group className='mb-3'>
//          <Form.Label htmlFor='email'>Email</Form.Label>
//          <Form.Control
//            type='text'
//            placeholder='Your email'
//            name='email'
//            onChange={handleInputChange}
//            value={userFormData.email || ''}
//            required
//          />
//          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
//        </Form.Group>


//        <Form.Group className='mb-3'>
//          <Form.Label htmlFor='password'>Password</Form.Label>
//          <Form.Control
//            type='password'
//            placeholder='Your password'
//            name='password'
//            onChange={handleInputChange}
//            value={userFormData.password || ''}
//            required
//          />
//          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
//        </Form.Group>
//        <Button
//          disabled={!(userFormData.email && userFormData.password)}
//          type='submit'
//          variant='success'>
//          Submit
//        </Button>
//      </Form>
//    </>
//  );
// };

export default LoginForm;
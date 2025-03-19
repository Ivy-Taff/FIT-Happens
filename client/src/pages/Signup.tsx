import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await addUser({
        variables: { input: { ...formState } },
      });
      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="d-flex justify-content-center align-items-center vh-100">
      <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="card-header bg-dark text-light">
          <h4 className="mb-0">Sign Up</h4>
        </div>
        <div className="card-body">
          {data ? (
            <div className="alert alert-success" role="alert">
              Success! You may now head <Link to="/">back to the homepage.</Link>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  className="form-control"
                  id="username"
                  placeholder="Your username"
                  name="username"
                  type="text"
                  value={formState.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  className="form-control"
                  id="email"
                  placeholder="Your email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  className="form-control"
                  id="password"
                  placeholder="******"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                className="btn btn-primary w-100"
                style={{ cursor: 'pointer' }}
                type="submit"
              >
                Submit
              </button>
            </form>
          )}
          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error.message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Signup;

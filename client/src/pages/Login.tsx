import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN_USER);

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
      const { data } = await login({
        variables: { ...formState },
      });
      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }
    setFormState({ email: '', password: '' });
  };

  return (
    <main>
      <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="card-header bg-dark text-light">
          <h4 className="mb-0">Login</h4>
        </div>
        <div className="card-body">
          {data ? (
            <div className="alert alert-success" role="alert">
              Success! You may now head <Link to="/">back to the homepage.</Link>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Your email"
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
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formState.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
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

export default Login;

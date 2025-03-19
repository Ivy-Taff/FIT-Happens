import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.jsx';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ErrorPage from './pages/Error';
import ExerciseList from './pages/ExerciseList.js';
import WorkoutCalendar from './components/WorkoutCalendar.js';
import SavedWorkouts from './pages/SavedWorkouts.js';
import NoUserHome from './pages/NoUserHome.js';
import Auth from './utils/auth.js';
import NoUserBrowse from './pages/NoUserBrowse.js';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: Auth.loggedIn() ? <Home /> : <NoUserHome />,
      }, {
        path: '/login',
        element: <Login />
      }, {
        path: '/signup',
        element: <Signup />
      }, {
        path: '/exercises',
        element: Auth.loggedIn() ? <ExerciseList /> : <NoUserBrowse />
      }, {
        path: '/calendar',
        element: <WorkoutCalendar />
      }, {
        path: '/saved',
        element: <SavedWorkouts />
      }
    ]
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}


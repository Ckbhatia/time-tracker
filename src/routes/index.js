import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import Home from '../components/Home';
import { routes } from '../constants/routes';

export const protectedRoutes = [
  { path: routes.tracker, element: Home },
];

export const publicRoutes = [
  { path: routes.login, element: Login },
  { path: routes.register, element: Register },
];
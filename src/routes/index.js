import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import Home from '../components/Home';
import MyProfile from '../components/Profile/MyProfile';
import { routes } from '../constants/routes';

export const protectedRoutes = [
  { path: routes.tracker, element: Home },
  { path: routes.profile, element: MyProfile },
];

export const publicRoutes = [
  { path: routes.login, element: Login },
  { path: routes.register, element: Register },
];

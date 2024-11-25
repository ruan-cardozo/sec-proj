import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UnauthorizedPage from '../pages/UnauthorizedPage';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  console.log(isAuthenticated);

  return isAuthenticated ? <Outlet /> : <UnauthorizedPage />;
};

export default ProtectedRoute;
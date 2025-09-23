import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, children, redirectTo, adminRoute }) {
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (adminRoute && !user.is_admin) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default ProtectedRoute;

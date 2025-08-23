import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, children, redirectTo }) {
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}

export default ProtectedRoute;

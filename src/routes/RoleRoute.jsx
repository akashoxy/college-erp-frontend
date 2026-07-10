import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
}

export default function RoleRoute({
  children,
  allowedRoles = [],
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
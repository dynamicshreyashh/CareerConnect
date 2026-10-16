import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, role }) => {
  const { user, authReady } = useSelector((store) => store.auth);
  const location = useLocation();
  if (!authReady) return <div className="min-h-screen grid place-items-center text-sm text-slate-500">Loading your workspace…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to={user.role === "recruiter" ? "/admin/companies" : "/"} replace />;
  return children;
};

export default ProtectedRoute;

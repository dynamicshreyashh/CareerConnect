import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./utils/loadUser";
import { setAuthReady } from "./redux/authSlice";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import SavedJobs from "./components/SavedJobs";
import EditJob from "./components/admin/EditJob";
import NotFound from "./components/NotFound";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/jobs", element: <Jobs /> },
  { path: "/description/:id", element: <JobDescription /> },
  { path: "/browse", element: <Browse /> },
  { path: "/profile", element: <ProtectedRoute role="student"><Profile /></ProtectedRoute> },
  { path: "/saved-jobs", element: <ProtectedRoute role="student"><SavedJobs /></ProtectedRoute> },
  { path: "/admin/companies", element: <ProtectedRoute role="recruiter"><Companies /></ProtectedRoute> },
  { path: "/admin/jobs", element: <ProtectedRoute role="recruiter"><AdminJobs /></ProtectedRoute> },
  { path: "/admin/jobs/create", element: <ProtectedRoute role="recruiter"><PostJob /></ProtectedRoute> },
  { path: "/admin/jobs/:id/edit", element: <ProtectedRoute role="recruiter"><EditJob /></ProtectedRoute> },
  { path: "/admin/companies/create", element: <ProtectedRoute role="recruiter"><CompanyCreate /></ProtectedRoute> },
  { path: "/admin/companies/:id", element: <ProtectedRoute role="recruiter"><CompanySetup /></ProtectedRoute> },
  { path: "/admin/jobs/:id/applicants", element: <ProtectedRoute role="recruiter"><Applicants /></ProtectedRoute> },
  { path: "*", element: <NotFound /> },
]);

function App() {
  const dispatch = useDispatch();
  const { authReady } = useSelector((store) => store.auth);
  useEffect(() => {
    dispatch(setAuthReady(false));
    loadUser(dispatch);
  }, [dispatch]);
  if (!authReady) return <div className="min-h-screen grid place-items-center bg-slate-50"><div className="text-sm text-slate-500 flex items-center gap-3"><span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />Preparing your CareerConnect workspace…</div></div>;
  return <RouterProvider router={router} />;
}

export default App;

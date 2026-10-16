import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthReady, setLoading, setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constants";
import Navbar from "../shared/Navbar";

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "", role: "student" });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) navigate(user.role === "recruiter" ? "/admin/companies" : (location.state?.from || "/"), { replace: true });
  }, [user, navigate, location.state]);

  const change = (event) => setInput((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!input.role) {
      toast.error("Choose a student or recruiter account.");
      return;
    }
    dispatch(setLoading(true));
    try {
      const response = await axios.post(USER_API_END_POINT + "/login", input, { withCredentials: true });
      if (response.data.success) {
        dispatch(setUser(response.data.user));
        dispatch(setAuthReady(true));
        toast.success(response.data.message || "Welcome back.");
        const next = location.state?.from || (response.data.user.role === "recruiter" ? "/admin/companies" : "/");
        navigate(next, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to sign in. Check the API connection and your credentials.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="cc-auth-page flex-1">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[.9fr_1.1fr] gap-7 items-stretch">
          <aside className="hidden lg:flex flex-col justify-between rounded-3xl p-9 text-white overflow-hidden relative" style={{ background: "linear-gradient(145deg,#30266f 0%,#5549bf 56%,#8173ed 100%)" }}>
            <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full border border-white/20" style={{ boxShadow: "0 0 0 35px #ffffff0c,0 0 0 75px #ffffff08" }} />
            <div className="relative"><div className="w-12 h-12 grid place-items-center rounded-2xl bg-white/15 border border-white/20"><BriefcaseBusiness size={23} /></div><p className="mt-9 uppercase tracking-[.2em] text-[10px] font-extrabold text-violet-200">CAREERCONNECT</p><h1 className="text-4xl font-extrabold leading-tight tracking-tight mt-3">Good things happen when you find your fit.</h1><p className="mt-5 text-sm leading-7 text-violet-100 max-w-sm">Your next opportunity, meaningful connections, and a more organized job search start right here.</p></div>
            <div className="relative rounded-2xl p-5 bg-white/10 border border-white/15"><div className="flex items-center gap-3"><span className="w-10 h-10 grid place-items-center rounded-xl bg-emerald-300/20 text-emerald-100"><ShieldCheck size={18} /></span><div><strong className="block text-sm">One workspace. Two paths.</strong><p className="text-xs text-violet-100 mt-1">Candidate discovery and recruiter hiring tools.</p></div></div></div>
          </aside>
          <section className="cc-auth-panel">
            <span className="cc-eyebrow">WELCOME BACK</span>
            <h2 className="font-extrabold text-3xl tracking-tight mt-3">Sign in to continue.</h2>
            <p className="text-sm leading-6 text-slate-500 mt-2">Pick up where you left off and keep your next move in motion.</p>
            <form onSubmit={submit} className="mt-7 space-y-5">
              <div><label htmlFor="email" className="cc-form-label">Email address</label><input id="email" className="cc-form-control" type="email" autoComplete="email" name="email" value={input.email} onChange={change} placeholder="you@example.com" required /></div>
              <div><label htmlFor="password" className="cc-form-label">Password</label><div className="relative"><input id="password" className="cc-form-control pr-12" type={showPassword ? "text" : "password"} autoComplete="current-password" name="password" value={input.password} onChange={change} placeholder="Enter your password" required minLength={8} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
              <fieldset><legend className="cc-form-label mb-2">I am signing in as</legend><div className="grid grid-cols-2 gap-3">
                {[{ value: "student", title: "Student", description: "Discover and apply" }, { value: "recruiter", title: "Recruiter", description: "Hire great people" }].map((role) => <label key={role.value} className={"cursor-pointer rounded-xl border p-3 transition " + (input.role === role.value ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100" : "border-slate-200 hover:border-slate-300")}><input className="sr-only" type="radio" name="role" value={role.value} checked={input.role === role.value} onChange={change} /><span className="block font-bold text-sm">{role.title}</span><span className="block text-xs text-slate-500 mt-1">{role.description}</span></label>)}
              </div></fieldset>
              <button type="submit" disabled={loading} className="cc-btn cc-btn-primary w-full !py-3.5 disabled:opacity-60">{loading ? "Signing you in…" : "Sign in"} {!loading && <ArrowRight size={17} />}</button>
            </form>
            <p className="text-sm text-center text-slate-500 mt-6">New to CareerConnect? <Link to="/signup" className="text-violet-600 font-extrabold hover:underline">Create an account</Link></p>
            <p className="text-[11px] text-center leading-5 text-slate-400 mt-5">Sign in with the same account type you selected when registering.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Login;

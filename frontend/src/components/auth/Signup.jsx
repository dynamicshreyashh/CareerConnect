import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constants";
import Navbar from "../shared/Navbar";

const Signup = () => {
  const [input, setInput] = useState({ fullName: "", email: "", phoneNumber: "", password: "", role: "student", file: null });
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(user.role === "recruiter" ? "/admin/companies" : "/", { replace: true });
  }, [user, navigate]);

  const change = (event) => setInput((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!input.role) return toast.error("Choose a student or recruiter account.");
    const data = new FormData();
    data.append("fullName", input.fullName.trim());
    data.append("email", input.email.trim().toLowerCase());
    data.append("phoneNumber", input.phoneNumber.trim());
    data.append("password", input.password);
    data.append("role", input.role);
    if (input.file) data.append("file", input.file);

    dispatch(setLoading(true));
    try {
      const response = await axios.post(USER_API_END_POINT + "/register", data, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message || "Your account has been created.");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create your account. Check that the API is running.");
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
            <div className="relative"><div className="w-12 h-12 grid place-items-center rounded-2xl bg-white/15 border border-white/20"><BriefcaseBusiness size={23} /></div><p className="mt-9 uppercase tracking-[.2em] text-[10px] font-extrabold text-violet-200">YOUR NEXT CHAPTER</p><h1 className="text-4xl font-extrabold leading-tight tracking-tight mt-3">Start with a profile. Build what comes next.</h1><p className="mt-5 text-sm leading-7 text-violet-100 max-w-sm">Whether you're stepping into your career or building a team, your next step starts here.</p></div>
            <div className="relative space-y-4"><div className="flex items-center gap-3"><span className="w-9 h-9 grid place-items-center rounded-xl bg-white/10"><CheckCircle2 size={17} /></span><span className="text-sm text-violet-100">A dedicated space for applications</span></div><div className="flex items-center gap-3"><span className="w-9 h-9 grid place-items-center rounded-xl bg-white/10"><UserRound size={17} /></span><span className="text-sm text-violet-100">A hiring workspace for recruiters</span></div></div>
          </aside>
          <section className="cc-auth-panel">
            <span className="cc-eyebrow">GET STARTED</span>
            <h2 className="font-extrabold text-3xl tracking-tight mt-3">Create your account.</h2>
            <p className="text-sm leading-6 text-slate-500 mt-2">A few details now. More opportunities ahead.</p>
            <form onSubmit={submit} className="mt-7 space-y-4">
              <div><label htmlFor="fullName" className="cc-form-label">Full name</label><input id="fullName" className="cc-form-control" autoComplete="name" type="text" name="fullName" value={input.fullName} onChange={change} placeholder="Your name" required minLength={2} maxLength={100} /></div>
              <div><label htmlFor="email" className="cc-form-label">Email address</label><input id="email" className="cc-form-control" autoComplete="email" type="email" name="email" value={input.email} onChange={change} placeholder="you@example.com" required /></div>
              <div><label htmlFor="phoneNumber" className="cc-form-label">Phone number</label><input id="phoneNumber" className="cc-form-control" autoComplete="tel" type="tel" name="phoneNumber" value={input.phoneNumber} onChange={change} placeholder="Your contact number" required minLength={7} maxLength={16} /></div>
              <div><label htmlFor="password" className="cc-form-label">Create password</label><input id="password" className="cc-form-control" autoComplete="new-password" type="password" name="password" value={input.password} onChange={change} placeholder="At least 8 characters" required minLength={8} /></div>
              <fieldset><legend className="cc-form-label mb-2">Choose your account</legend><div className="grid grid-cols-2 gap-3">
                {[{ value: "student", title: "I'm a student", description: "Find roles and apply" }, { value: "recruiter", title: "I'm a recruiter", description: "Post jobs and hire" }].map((role) => <label key={role.value} className={"cursor-pointer rounded-xl border p-3 transition " + (input.role === role.value ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100" : "border-slate-200 hover:border-slate-300")}><input className="sr-only" type="radio" name="role" value={role.value} checked={input.role === role.value} onChange={change} /><span className="block font-bold text-sm">{role.title}</span><span className="block text-xs text-slate-500 mt-1">{role.description}</span></label>)}
              </div></fieldset>
              <div><label htmlFor="profilePhoto" className="cc-form-label">Profile photo <span className="font-normal text-slate-400">(optional)</span></label><input id="profilePhoto" className="cc-form-control !p-2.5 text-xs" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setInput((current) => ({ ...current, file: event.target.files?.[0] || null }))} /><p className="text-[11px] text-slate-400 mt-1">A clear photo helps personalize your profile.</p></div>
              <button type="submit" disabled={loading} className="cc-btn cc-btn-primary w-full !py-3.5 disabled:opacity-60">{loading ? "Creating your account…" : "Create account"} {!loading && <ArrowRight size={17} />}</button>
            </form>
            <p className="text-sm text-center text-slate-500 mt-6">Already have an account? <Link to="/login" className="text-violet-600 font-extrabold hover:underline">Sign in</Link></p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Signup;

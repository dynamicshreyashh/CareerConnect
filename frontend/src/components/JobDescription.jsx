import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, Clock3, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { setSingleJob } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constants";

const JobDescription = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(JOB_API_END_POINT + "/get/" + id);
        if (!response.data.success) throw new Error(response.data.message || "Unable to load this job.");
        if (active) {
          setJob(response.data.job);
          dispatch(setSingleJob(response.data.job));
        }
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || requestError.message || "Unable to load this job.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [id, dispatch]);

  useEffect(() => {
    let active = true;
    const check = async () => {
      if (!user || user.role !== "student") {
        setApplication(null);
        return;
      }
      try {
        const response = await axios.get(APPLICATION_API_END_POINT + "/check/" + id, { withCredentials: true });
        if (active && response.data.success) setApplication(response.data.application || null);
      } catch (requestError) {
        if (requestError.response?.status !== 401 && active) {
          console.error("Unable to check application status:", requestError.response?.data?.message || requestError.message);
        }
      }
    };
    check();
    return () => { active = false; };
  }, [id, user?._id, user?.role]);

  const apply = async () => {
    if (!user) {
      toast.info("Sign in with your student account to apply.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (user.role !== "student") {
      toast.error("Recruiter accounts cannot submit job applications.");
      return;
    }
    if (application) return;
    try {
      setApplyLoading(true);
      const response = await axios.post(APPLICATION_API_END_POINT + "/apply/" + id, {}, { withCredentials: true });
      if (response.data.success) {
        setApplication({ _id: response.data.applicationId, status: "pending", createdAt: new Date().toISOString() });
        toast.success("Application submitted. Good luck!");
      }
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Could not submit your application.");
    } finally {
      setApplyLoading(false);
    }
  };

  const company = job?.company;
  const companyName = company?.name || "Hiring company";
  const requirements = Array.isArray(job?.requirements) ? job.requirements : String(job?.requirements || "").split(",").map((value) => value.trim()).filter(Boolean);
  const posted = job?.createdAt ? new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recently";
  const salary = job?.salary ? Number(job.salary).toLocaleString("en-IN") + " LPA" : "Salary discussed";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="cc-content-width flex-1">
        <button className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 mb-6" type="button" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back to opportunities</button>
        {loading ? <div className="cc-empty-state">Loading job details…</div> : error || !job ? (
          <div className="cc-empty-state"><BriefcaseBusiness size={27} className="mx-auto mb-3 text-violet-500" /><strong className="block text-slate-800">We couldn't find this role</strong><p className="mt-2">{error || "This job may have been removed."}</p><Button className="mt-4 bg-violet-600 text-white" onClick={() => navigate("/jobs")}>Browse other jobs</Button></div>
        ) : (
          <>
            <section className="cc-dashboard-card !p-6 md:!p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-7">
                <div className="flex gap-4 min-w-0">
                  {company?.logo ? <img src={company.logo} alt={companyName + " logo"} className="w-16 h-16 rounded-2xl border border-slate-100 object-contain p-2 bg-white" /> : <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 grid place-items-center font-extrabold text-xl">{companyName.slice(0,1).toUpperCase()}</div>}
                  <div className="min-w-0"><span className="cc-eyebrow">CAREER OPPORTUNITY</span><h1 className="font-extrabold text-2xl md:text-3xl tracking-tight mt-2 break-words">{job.title}</h1><p className="text-sm text-slate-500 mt-2">{companyName}</p><div className="flex flex-wrap gap-2 mt-4"><Badge variant="secondary">{job.jobType || "Role"}</Badge><Badge variant="secondary">{job.location || "Flexible location"}</Badge><Badge variant="secondary">{job.experienceLevel || 0} years experience</Badge></div></div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-3 md:min-w-48">
                  <div className="text-left md:text-right"><div className="text-2xl font-extrabold text-slate-900">{salary}</div><div className="text-xs text-slate-500 mt-1">Listed compensation</div></div>
                  {user?.role === "student" ? <Button onClick={apply} disabled={Boolean(application) || applyLoading} className={application ? "bg-emerald-600 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}>{applyLoading ? "Submitting…" : application ? <><CheckCircle2 size={16} className="mr-2" /> Applied</> : <>Apply for this role <ArrowUpRight size={16} className="ml-2" /></>}</Button> : !user ? <Button onClick={apply} className="bg-violet-600 hover:bg-violet-700 text-white">Sign in to apply <ArrowUpRight size={16} className="ml-2" /></Button> : <span className="text-xs rounded-lg bg-amber-50 text-amber-800 p-3">Recruiter view · Applications are for students</span>}
                  {application && <span className="text-xs text-emerald-700 font-bold capitalize">Status: {application.status || "pending"}</span>}
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 border-t border-slate-100 mt-7 pt-6">
                <div className="flex gap-3 items-center"><span className="w-9 h-9 rounded-xl bg-slate-50 grid place-items-center text-slate-500"><MapPin size={17} /></span><div><span className="block text-[10px] uppercase tracking-wide text-slate-400 font-bold">Location</span><strong className="text-xs">{job.location || "Not specified"}</strong></div></div>
                <div className="flex gap-3 items-center"><span className="w-9 h-9 rounded-xl bg-slate-50 grid place-items-center text-slate-500"><Clock3 size={17} /></span><div><span className="block text-[10px] uppercase tracking-wide text-slate-400 font-bold">Work type</span><strong className="text-xs">{job.jobType || "Not specified"}</strong></div></div>
                <div className="flex gap-3 items-center"><span className="w-9 h-9 rounded-xl bg-slate-50 grid place-items-center text-slate-500"><CalendarDays size={17} /></span><div><span className="block text-[10px] uppercase tracking-wide text-slate-400 font-bold">Posted on</span><strong className="text-xs">{posted}</strong></div></div>
              </div>
            </section>
            <div className="grid lg:grid-cols-[1fr_300px] gap-5 mt-5">
              <section className="cc-dashboard-card">
                <h2 className="font-extrabold text-lg tracking-tight">About the role</h2>
                <p className="text-sm leading-7 text-slate-600 mt-4 whitespace-pre-line">{job.description || "The recruiter has not provided a detailed description yet."}</p>
                <div className="border-t border-slate-100 mt-7 pt-6"><h2 className="font-extrabold text-lg tracking-tight">What you'll bring</h2>
                  {requirements.length ? <ul className="mt-4 space-y-3">{requirements.map((requirement, index) => <li className="flex gap-3 text-sm text-slate-600 leading-6" key={index}><CheckCircle2 size={17} className="mt-1 shrink-0 text-emerald-500" />{requirement}</li>)}</ul> : <p className="text-sm text-slate-500 mt-3">Requirements will be shared by the recruiter.</p>}
                </div>
              </section>
              <aside className="cc-dashboard-card h-fit">
                <span className="cc-eyebrow">ROLE SNAPSHOT</span>
                <div className="mt-4 space-y-4">
                  <div className="flex gap-3 items-start"><BriefcaseBusiness size={17} className="text-violet-500 mt-0.5" /><div><span className="block text-xs text-slate-400">Open positions</span><strong className="text-sm">{job.position || 1}</strong></div></div>
                  <div className="flex gap-3 items-start"><Users size={17} className="text-violet-500 mt-0.5" /><div><span className="block text-xs text-slate-400">Experience</span><strong className="text-sm">{job.experienceLevel || 0} years</strong></div></div>
                  <div className="flex gap-3 items-start"><Building2 size={17} className="text-violet-500 mt-0.5" /><div><span className="block text-xs text-slate-400">Company</span><strong className="text-sm">{companyName}</strong>{company?.website && <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-violet-600 mt-1 hover:underline">Company website <ArrowUpRight size={12} /></a>}</div></div>
                </div>
                <div className="rounded-xl bg-violet-50 p-4 mt-6"><strong className="text-xs text-violet-900">Ready to take the next step?</strong><p className="text-xs leading-5 text-violet-700 mt-1">Keep your profile and resume up to date to make applying easier.</p>{user?.role === "student" && <Button size="sm" variant="outline" onClick={() => navigate("/profile")} className="mt-3 bg-white">View my profile</Button>}</div>
              </aside>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default JobDescription;

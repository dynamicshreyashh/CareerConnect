import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Download, Mail, Pencil, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDailog from "./UpdateProfileDailog";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { setIsResume } from "@/redux/authSlice";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user, isResume } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => { if (user?.profile?.resume) dispatch(setIsResume(true)); }, [user?.profile?.resume, dispatch]);

  const initials = user?.fullName?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "CC";
  const skills = user?.profile?.skills || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="cc-content-width flex-1">
        <div className="cc-page-heading"><span className="cc-eyebrow">YOUR CAREER HUB</span><h1>Your profile, your progress.</h1><p>Keep your candidate details current and follow your opportunities from one place.</p></div>
        <section className="cc-dashboard-card !p-0 overflow-hidden">
          <div className="h-28 relative" style={{ background: "linear-gradient(105deg,#e8e5ff 0%,#f0eeff 52%,#dff8ed 100%)" }}><div className="absolute -right-3 -top-12 w-48 h-48 rounded-full border border-white/70" style={{ boxShadow: "0 0 0 24px #ffffff22" }} /></div>
          <div className="px-5 pb-6 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 relative">
              <div className="w-20 h-20 rounded-2xl border-4 border-white bg-violet-100 text-violet-700 grid place-items-center text-xl font-extrabold shadow-sm overflow-hidden shrink-0">{user?.profile?.profilePhoto ? <img src={user.profile.profilePhoto} alt={user.fullName} className="w-full h-full object-cover" /> : initials}</div>
              <div className="flex-1 min-w-0 pt-1"><h2 className="font-extrabold text-2xl tracking-tight">{user?.fullName || "Your name"}</h2><p className="text-sm text-slate-500 mt-1">{user?.profile?.bio || "Add a short professional summary to help recruiters understand your focus."}</p></div>
              <Button onClick={() => setOpen(true)} variant="outline" className="shrink-0 rounded-xl"><Pencil size={15} className="mr-2" /> Edit profile</Button>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-3"><span className="w-9 h-9 rounded-xl grid place-items-center bg-slate-50 text-slate-500"><Mail size={16} /></span><div className="min-w-0"><span className="block text-[10px] uppercase tracking-wide text-slate-400 font-bold">Email</span><strong className="block text-xs truncate">{user?.email}</strong></div></div>
              <div className="flex items-center gap-3"><span className="w-9 h-9 rounded-xl grid place-items-center bg-slate-50 text-slate-500"><Phone size={16} /></span><div><span className="block text-[10px] uppercase tracking-wide text-slate-400 font-bold">Phone</span><strong className="block text-xs">{user?.phoneNumber || "Add a phone number"}</strong></div></div>
              <div className="flex items-center gap-3"><span className="w-9 h-9 rounded-xl grid place-items-center bg-slate-50 text-slate-500"><ShieldCheck size={16} /></span><div><span className="block text-[10px] uppercase tracking-wide text-slate-400 font-bold">Account type</span><strong className="block text-xs capitalize">Student account</strong></div></div>
            </div>
          </div>
        </section>
        <div className="grid lg:grid-cols-[.85fr_1.15fr] gap-5 mt-5">
          <section className="cc-dashboard-card">
            <div className="flex items-center gap-2"><Sparkles size={17} className="text-violet-500" /><h3 className="font-extrabold text-base">Skills and strengths</h3></div>
            <p className="text-xs text-slate-500 mt-2 leading-5">Add relevant skills so your profile tells a clearer story.</p>
            <div className="flex flex-wrap gap-2 mt-4">{skills.length ? skills.map((skill, index) => <Badge key={skill + index} className="border border-violet-100 bg-violet-50 text-violet-700 font-semibold">{skill}</Badge>) : <span className="text-xs text-slate-400">No skills added yet.</span>}</div>
            <button type="button" className="text-xs font-bold text-violet-600 hover:underline mt-4" onClick={() => setOpen(true)}>{skills.length ? "Update skills" : "Add your skills"} ↗</button>
          </section>
          <section className="cc-dashboard-card">
            <div className="flex items-center gap-2"><Download size={17} className="text-violet-500" /><h3 className="font-extrabold text-base">Your resume</h3></div>
            <p className="text-xs text-slate-500 mt-2 leading-5">Keep a current resume ready so applying to the right role takes less effort.</p>
            {isResume && user?.profile?.resume ? <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center"><Download size={17} /></span><div className="flex-1 min-w-0"><strong className="block text-xs truncate">{user.profile.resumeOriginalName || "Uploaded resume"}</strong><a href={user.profile.resume} target="_blank" rel="noreferrer" className="text-xs text-violet-600 hover:underline mt-1 inline-block">Open document ↗</a></div></div> : <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-4"><p className="text-xs text-slate-500">No resume uploaded yet.</p><Button onClick={() => setOpen(true)} size="sm" className="mt-3 bg-violet-600 text-white hover:bg-violet-700">Upload resume</Button></div>}
          </section>
        </div>
        <section className="mt-8"><div className="flex items-end justify-between gap-4 mb-4"><div><span className="cc-eyebrow">APPLICATION TRACKER</span><h2 className="font-extrabold text-xl tracking-tight mt-2">Your applications</h2></div><button className="text-xs font-bold text-violet-600 hover:underline" type="button" onClick={() => navigate("/jobs")}>Find another role ↗</button></div><AppliedJobTable /></section>
      </main>
      <Footer />
      <UpdateProfileDailog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Plus, Users, Building2, Search } from "lucide-react";
import Navbar from "../shared/Navbar";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [query, setQuery] = useState("");
  const { allAdminJobs = [] } = useSelector((store) => store.job);
  const { companies = [] } = useSelector((store) => store.company);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => { dispatch(setSearchJobByText(query)); }, [query, dispatch]);

  const applicantCount = allAdminJobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
  const openRoles = allAdminJobs.reduce((sum, job) => sum + Number(job.position || 0), 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="cc-content-width">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-7">
          <div className="cc-page-heading !mb-0"><span className="cc-eyebrow">RECRUITER WORKSPACE</span><h1>Your hiring dashboard.</h1><p>Manage your openings, review applicants, and keep every hire moving.</p></div>
          <button type="button" className="cc-btn cc-btn-primary shrink-0" onClick={() => navigate("/admin/jobs/create")}><Plus size={17} /> Post a job</button>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <div className="cc-dashboard-card flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 grid place-items-center"><BriefcaseBusiness size={19} /></span><div><span className="block text-xs text-slate-500">Published roles</span><strong className="text-xl font-extrabold">{allAdminJobs.length}</strong></div></div>
          <div className="cc-dashboard-card flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center"><Users size={19} /></span><div><span className="block text-xs text-slate-500">Total applications</span><strong className="text-xl font-extrabold">{applicantCount}</strong></div></div>
          <div className="cc-dashboard-card flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 grid place-items-center"><Building2 size={19} /></span><div><span className="block text-xs text-slate-500">Open positions</span><strong className="text-xl font-extrabold">{openRoles}</strong></div></div>
        </div>
        <section className="cc-dashboard-card !p-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-100"><div><h2 className="font-extrabold text-base">Job postings</h2><p className="text-xs text-slate-500 mt-1">Every listing is associated with one of your companies.</p></div><label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 bg-white sm:w-72"><Search size={16} className="text-slate-400" /><input className="min-w-0 flex-1 py-2.5 outline-none text-xs" placeholder="Filter by role, company, location…" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>
          <div className="p-4 md:p-5"><AdminJobsTable /></div>
        </section>
        {!companies.length && <p className="text-xs text-slate-500 mt-4">Need to post your first role? <button className="text-violet-600 font-bold hover:underline" onClick={() => navigate("/admin/companies/create")} type="button">Create a company profile first.</button></p>}
      </main>
    </div>
  );
};

export default AdminJobs;

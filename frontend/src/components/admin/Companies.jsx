import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Building2, Plus, Search, BriefcaseBusiness, Globe2 } from "lucide-react";
import Navbar from "../shared/Navbar";
import CompaniesTable from "./CompaniesTable";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { setSearchCompanyByText } from "@/redux/companySlice";

const Companies = () => {
  useGetAllCompanies();
  const [query, setQuery] = useState("");
  const { companies = [] } = useSelector((store) => store.company);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => { dispatch(setSearchCompanyByText(query)); }, [query, dispatch]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="cc-content-width">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-7">
          <div className="cc-page-heading !mb-0"><span className="cc-eyebrow">RECRUITER WORKSPACE</span><h1>Your employer profiles.</h1><p>Organize the companies you recruit for and keep each opportunity connected to the right identity.</p></div>
          <button type="button" className="cc-btn cc-btn-primary shrink-0" onClick={() => navigate("/admin/companies/create")}><Plus size={17} /> Add company</button>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <div className="cc-dashboard-card flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 grid place-items-center"><Building2 size={19} /></span><div><span className="block text-xs text-slate-500">Your companies</span><strong className="text-xl font-extrabold">{companies.length}</strong></div></div>
          <div className="cc-dashboard-card flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center"><BriefcaseBusiness size={19} /></span><div><span className="block text-xs text-slate-500">Recruiter identity</span><strong className="text-sm font-extrabold">Ownership protected</strong></div></div>
          <div className="cc-dashboard-card flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 grid place-items-center"><Globe2 size={19} /></span><div><span className="block text-xs text-slate-500">Public-facing profile</span><strong className="text-sm font-extrabold">Logo · website · details</strong></div></div>
        </div>
        <section className="cc-dashboard-card !p-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-100"><div><h2 className="font-extrabold text-base">Companies</h2><p className="text-xs text-slate-500 mt-1">Only companies linked to your recruiter account appear here.</p></div><label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 bg-white sm:w-64"><Search size={16} className="text-slate-400" /><input className="min-w-0 flex-1 py-2.5 outline-none text-xs" placeholder="Search company name…" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>
          <div className="p-4 md:p-5"><CompaniesTable /></div>
        </section>
      </main>
    </div>
  );
};

export default Companies;

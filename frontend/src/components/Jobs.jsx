import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import Job from "./Job";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Jobs = () => {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [query, setQuery] = useState(searchedQuery || "");
  const [location, setLocation] = useState("All locations");
  const [type, setType] = useState("All types");
  const [sort, setSort] = useState("newest");

  useEffect(() => { setQuery(searchedQuery || ""); }, [searchedQuery]);

  const filteredJobs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...allJobs].filter((job) => {
      const text = [job.title, job.description, job.location, job.jobType, job.company?.name, ...(Array.isArray(job.requirements) ? job.requirements : [])].filter(Boolean).join(" ").toLowerCase();
      const matchesQuery = !normalized || text.includes(normalized);
      const matchesLocation = location === "All locations" || String(job.location || "").toLowerCase().includes(location.toLowerCase());
      const matchesType = type === "All types" || String(job.jobType || "").toLowerCase().includes(type.toLowerCase());
      return matchesQuery && matchesLocation && matchesType;
    }).sort((a, b) => sort === "salary" ? Number(b.salary || 0) - Number(a.salary || 0) : new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [allJobs, query, location, type, sort]);

  const clearFilters = () => { setQuery(""); setLocation("All locations"); setType("All types"); setSort("newest"); };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="cc-content-width flex-1">
        <div className="cc-page-heading"><span className="cc-eyebrow">YOUR NEXT OPPORTUNITY</span><h1>Find your kind of work.</h1><p>Explore real openings from recruiter accounts and discover your next step.</p></div>
        <div className="cc-dashboard-card mb-6 !p-4 md:!p-5">
          <div className="grid md:grid-cols-[1fr_190px_160px_auto] items-end gap-3">
            <label><span className="cc-form-label">Search roles</span><span className="flex items-center gap-2 border border-slate-200 rounded-xl px-3"><Search size={17} className="text-slate-400" /><input className="flex-1 min-w-0 py-3 outline-none text-sm" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, skill, or company" /></span></label>
            <label><span className="cc-form-label">Location</span><select className="cc-form-control" value={location} onChange={(event) => setLocation(event.target.value)}><option>All locations</option><option>Pune</option><option>Mumbai</option><option>Bengaluru</option><option>Hyderabad</option><option>Remote</option></select></label>
            <label><span className="cc-form-label">Work type</span><select className="cc-form-control" value={type} onChange={(event) => setType(event.target.value)}><option>All types</option><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option><option>Remote</option></select></label>
            <button type="button" className="cc-btn bg-slate-100 text-slate-700" onClick={clearFilters}><X size={15} /> Clear</button>
          </div>
          <div className="flex justify-between items-center gap-3 mt-4 pt-4 border-t border-slate-100"><span className="text-xs text-slate-500 flex gap-2 items-center"><SlidersHorizontal size={14} /> {filteredJobs.length} matching opening{filteredJobs.length === 1 ? "" : "s"}</span><label className="text-xs text-slate-500 flex gap-2 items-center">Sort by <select className="border border-slate-200 rounded-lg py-2 px-2 bg-white text-slate-700" value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="salary">Salary: high to low</option></select></label></div>
        </div>
        {filteredJobs.length ? <div className="cc-job-grid">{filteredJobs.map((job) => <Job key={job._id} job={job} />)}</div> : <div className="cc-empty-state"><Search size={27} className="mx-auto mb-3 text-violet-500" /><strong className="block text-slate-800">No roles match those filters</strong><p className="mt-2 mb-4">Try another keyword or reset the location and work-type filters.</p><button className="cc-btn cc-btn-primary" onClick={clearFilters} type="button">Reset filters</button></div>}
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;

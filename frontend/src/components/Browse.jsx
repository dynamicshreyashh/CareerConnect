import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import Job from "./Job";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { setSearchedQuery } from "@/redux/jobSlice";

const Browse = () => {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const results = useMemo(() => {
    const query = String(searchedQuery || "").trim().toLowerCase();
    if (!query) return allJobs;
    return allJobs.filter((job) => [job.title, job.description, job.location, job.jobType, job.company?.name, ...(Array.isArray(job.requirements) ? job.requirements : [])].filter(Boolean).join(" ").toLowerCase().includes(query));
  }, [allJobs, searchedQuery]);

  useEffect(() => () => dispatch(setSearchedQuery("")), [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="cc-content-width flex-1">
        <div className="cc-page-heading"><span className="cc-eyebrow">EXPLORE CAREERCONNECT</span><h1>{searchedQuery ? "Explore " + searchedQuery : "Opportunities picked for you."}</h1><p>Search results reflect job details posted by recruiters on CareerConnect.</p></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <span className="text-sm text-slate-500">{results.length} matching role{results.length === 1 ? "" : "s"}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 rounded-xl bg-white border border-slate-200"><Search size={16} className="text-slate-400" /><input aria-label="Refine search results" className="w-44 py-3 text-sm outline-none" value={searchedQuery} onChange={(event) => dispatch(setSearchedQuery(event.target.value))} placeholder="Refine by role…" /></div>
            <button type="button" className="text-sm font-bold text-violet-600 px-2" onClick={() => navigate("/jobs")}>Advanced filters</button>
          </div>
        </div>
        {results.length ? <div className="cc-job-grid">{results.map((job) => <Job key={job._id} job={job} />)}</div> : <div className="cc-empty-state"><Search size={27} className="mx-auto mb-3 text-violet-500" /><strong className="block text-slate-800">No matching jobs found</strong><p className="mt-2 mb-4">Try a broader job title, skill, or company keyword.</p><button className="cc-btn cc-btn-primary" type="button" onClick={() => dispatch(setSearchedQuery(""))}>View all jobs</button></div>}
      </main>
      <Footer />
    </div>
  );
};

export default Browse;

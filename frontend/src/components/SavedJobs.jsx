import { useEffect, useState } from "react";
import axios from "axios";
import { Bookmark, BriefcaseBusiness, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { USER_API_END_POINT } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import Job from "./Job";
import { Link } from "react-router-dom";

const SavedJobs = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadSaved = async () => {
      try {
        const response = await axios.get(USER_API_END_POINT + "/saved-jobs", { withCredentials: true });
        if (active && response.data.success) setJobs(response.data.jobs || []);
      } catch (error) {
        if (active) toast.error(error.response?.data?.message || "Unable to load saved jobs.");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadSaved();
    return () => { active = false; };
  }, []);

  const removeJob = async (jobId) => {
    try {
      const response = await axios.delete(USER_API_END_POINT + "/save-job/" + jobId, { withCredentials: true });
      if (response.data.success) {
        setJobs((current) => current.filter((job) => job._id !== jobId));
        if (user) dispatch(setUser({ ...user, savedJobs: response.data.savedJobs || [] }));
        toast.success("Removed from saved jobs.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not remove this saved job.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="cc-content-width flex-1">
        <div className="cc-page-heading"><span className="cc-eyebrow">YOUR SHORTLIST</span><h1>Saved jobs</h1><p>Opportunities you bookmarked to come back to when you are ready.</p></div>
        {loading ? <div className="cc-empty-state">Loading your saved jobs…</div> : jobs.length === 0 ? (
          <div className="cc-empty-state"><Bookmark size={28} className="mx-auto mb-3 text-violet-500" /><strong className="block text-slate-700">Nothing saved just yet</strong><p className="mt-2 mb-4">Bookmark a role that catches your eye and it will be waiting here.</p><Link className="cc-btn cc-btn-primary" to="/jobs">Explore jobs <BriefcaseBusiness size={15} /></Link></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {jobs.map((job) => <div key={job._id} className="relative"><Job job={job} /><button type="button" onClick={() => removeJob(job._id)} title="Remove saved job" className="absolute right-4 top-4 z-10 rounded-full border bg-white p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={16} /></button></div>)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SavedJobs;

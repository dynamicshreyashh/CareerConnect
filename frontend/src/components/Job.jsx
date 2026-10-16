import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, ArrowUpRight, BriefcaseBusiness, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constants";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [saving, setSaving] = useState(false);
  const companyName = job?.company?.name || "Hiring company";
  const initials = companyName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const isSaved = useMemo(() => (user?.savedJobs || []).some((saved) => String(saved?._id || saved) === String(job?._id)), [user?.savedJobs, job?._id]);
  const posted = job?.createdAt ? new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "New";

  const toggleSaved = async (event) => {
    event.stopPropagation();
    if (!user) {
      toast.info("Sign in with your student account to save jobs.");
      navigate("/login");
      return;
    }
    if (user.role !== "student") {
      toast.error("Only student accounts can save jobs.");
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      const response = isSaved
        ? await axios.delete(USER_API_END_POINT + "/save-job/" + job._id, { withCredentials: true })
        : await axios.post(USER_API_END_POINT + "/save-job/" + job._id, {}, { withCredentials: true });
      if (response.data.success) {
        const savedJobs = response.data.savedJobs || (isSaved ? (user.savedJobs || []).filter((saved) => String(saved?._id || saved) !== String(job._id)) : [...(user.savedJobs || []), job._id]);
        dispatch(setUser({ ...user, savedJobs }));
        toast.success(isSaved ? "Removed from saved jobs." : "Job saved for later.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update saved jobs.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="cc-job-card" onClick={() => navigate("/description/" + job._id)} onKeyDown={(event) => event.key === "Enter" && navigate("/description/" + job._id)} role="link" tabIndex={0}>
      <div className="cc-job-card-head">
        {job?.company?.logo ? <img className="cc-company-logo" src={job.company.logo} alt={companyName + " logo"} /> : <span className="cc-company-logo cc-company-initials">{initials || <BriefcaseBusiness size={18} />}</span>}
        <div className="flex items-center gap-2"><span className="cc-job-new">{posted}</span>{user?.role === "student" && <button type="button" aria-label={isSaved ? "Remove saved job" : "Save job"} title={isSaved ? "Remove saved job" : "Save job"} disabled={saving} onClick={toggleSaved} className="inline-grid place-items-center rounded-full border border-slate-100 bg-white p-2 text-violet-600 hover:bg-violet-50 disabled:opacity-50">{isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}</button>}</div>
      </div>
      <p className="cc-job-company">{companyName}</p>
      <h3>{job?.title || "Open position"}</h3>
      <p className="cc-job-description">{job?.description || "Explore this opportunity and see whether it is the right next step for you."}</p>
      <div className="cc-job-meta"><span><MapPin size={14} /> {job?.location || "Location flexible"}</span><span><BriefcaseBusiness size={14} /> {job?.jobType || "Full-time"}</span></div>
      <div className="cc-job-card-footer"><span>{job?.salary ? Number(job.salary).toLocaleString("en-IN") + " LPA" : "Compensation discussed"}<small>{job?.position || 1} opening{Number(job?.position || 1) === 1 ? "" : "s"} · {job?.experienceLevel ?? 0}+ yrs</small></span><span className="cc-job-arrow"><ArrowUpRight size={19} /></span></div>
    </article>
  );
};

export default Job;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Users, BriefcaseBusiness } from "lucide-react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";
import { APPLICATION_API_END_POINT } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setApplicant } from "@/redux/applicationSlice";
import { toast } from "sonner";

const Applicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState("Applicants");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    let active = true;
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const response = await axios.get(APPLICATION_API_END_POINT + "/" + id + "/applicants", { withCredentials: true });
        if (active && response.data.success) {
          dispatch(setApplicant(response.data.job));
          setJobTitle(response.data.job.title || "Job applicants");
          setCompanyName(response.data.job.company?.name || "");
        }
      } catch (error) {
        if (active) toast.error(error.response?.data?.message || "Unable to load applicants.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchApplicants();
    return () => { active = false; };
  }, [id, dispatch]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="cc-content-width">
        <button type="button" onClick={() => navigate("/admin/jobs")} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 mb-6"><ArrowLeft size={16} /> Back to job postings</button>
        <div className="cc-page-heading"><span className="cc-eyebrow">RECRUITER WORKSPACE</span><h1>{jobTitle}</h1><p>{companyName ? companyName + " · " : ""}Review candidates, open resumes, and move each application through your hiring pipeline.</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="cc-dashboard-card flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 grid place-items-center"><Users size={19} /></span><div><span className="block text-xs text-slate-500">Total applicants</span><strong className="text-xl font-extrabold">{applicants?.applications?.length || 0}</strong></div></div>
          <div className="cc-dashboard-card flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center"><BriefcaseBusiness size={19} /></span><div><span className="block text-xs text-slate-500">Shortlisted</span><strong className="text-xl font-extrabold">{applicants?.applications?.filter((app) => ["shortlisted", "interview", "accepted"].includes(app.status)).length || 0}</strong></div></div>
          <div className="cc-dashboard-card flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 grid place-items-center"><Users size={19} /></span><div><span className="block text-xs text-slate-500">Awaiting review</span><strong className="text-xl font-extrabold">{applicants?.applications?.filter((app) => ["pending", "under review"].includes(app.status)).length || 0}</strong></div></div>
        </div>
        {loading ? <div className="cc-empty-state">Loading candidate applications…</div> : <ApplicantsTable />}
      </main>
    </div>
  );
};

export default Applicants;

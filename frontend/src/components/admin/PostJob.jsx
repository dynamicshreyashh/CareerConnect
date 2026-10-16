import { useMemo, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Info, Send } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { JOB_API_END_POINT } from "@/utils/constants";

const empty = { title: "", description: "", requirements: "", salary: "", location: "", jobType: "Full-time", experience: "0", position: "1", companyId: "" };

const PostJob = () => {
  useGetAllCompanies();
  const { companies } = useSelector((store) => store.company);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [input, setInput] = useState(empty);
  const [loading, setLoading] = useState(false);
  const mine = useMemo(() => (companies || []).filter((company) => String(company.userId?._id || company.userId) === String(user?._id)), [companies, user?._id]);
  const change = (event) => setInput((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!mine.length) {
      toast.error("Add a company profile before posting a job.");
      navigate("/admin/companies/create");
      return;
    }
    if (!input.companyId) {
      toast.error("Select the company this job belongs to.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(JOB_API_END_POINT + "/post", {
        ...input,
        salary: Number(input.salary),
        experience: Number(input.experience),
        position: Number(input.position),
        requirements: input.requirements.split(",").map((item) => item.trim()).filter(Boolean),
      }, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message || "Your job has been published.");
        navigate("/admin/jobs", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to publish this job. Check the form and API connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="cc-content-width">
        <Link to="/admin/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 mb-6"><ArrowLeft size={16} /> Back to job postings</Link>
        <div className="cc-page-heading"><span className="cc-eyebrow">RECRUITER WORKSPACE</span><h1>Publish a new opportunity.</h1><p>Be clear about the role, expectations, and what makes your team worth joining.</p></div>
        {!mine.length ? <section className="cc-dashboard-card max-w-3xl"><span className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 grid place-items-center"><BriefcaseBusiness size={22} /></span><h2 className="text-lg font-extrabold mt-4">Add your company first</h2><p className="text-sm leading-6 text-slate-500 mt-2 max-w-lg">Every job listing is tied to a company in your recruiter account. Create the company profile first so applicants can see who is hiring.</p><button type="button" className="cc-btn cc-btn-primary mt-5" onClick={() => navigate("/admin/companies/create")}>Create company profile</button></section> : (
          <form onSubmit={submit} className="cc-dashboard-card max-w-4xl space-y-5">
            <div className="rounded-xl bg-violet-50 p-4 flex items-start gap-3"><Info size={17} className="text-violet-600 mt-0.5 shrink-0" /><p className="text-xs leading-5 text-violet-800">This listing will be published under your recruiter account and the company selected below. Only your account can edit or remove this posting and review its applicants.</p></div>
            <div className="grid md:grid-cols-2 gap-4">
              <label><span className="cc-form-label">Job title *</span><input className="cc-form-control" name="title" value={input.title} onChange={change} placeholder="e.g. Junior Java Developer" required maxLength={120} /></label>
              <label><span className="cc-form-label">Hiring company *</span><select className="cc-form-control" name="companyId" value={input.companyId} onChange={change} required><option value="">Select a company</option>{mine.map((company) => <option key={company._id} value={company._id}>{company.name}</option>)}</select></label>
              <label><span className="cc-form-label">Location *</span><input className="cc-form-control" name="location" value={input.location} onChange={change} placeholder="Pune / Mumbai / Remote" required /></label>
              <label><span className="cc-form-label">Work arrangement *</span><select className="cc-form-control" name="jobType" value={input.jobType} onChange={change} required>{["Full-time","Part-time","Internship","Contract","Remote","Hybrid"].map((type) => <option key={type}>{type}</option>)}</select></label>
              <label><span className="cc-form-label">Compensation (LPA) *</span><input className="cc-form-control" type="number" name="salary" min="0" step="0.1" value={input.salary} onChange={change} placeholder="e.g. 6.5" required /></label>
              <label><span className="cc-form-label">Experience required (years) *</span><input className="cc-form-control" type="number" name="experience" min="0" step="0.5" value={input.experience} onChange={change} required /></label>
              <label><span className="cc-form-label">Open positions *</span><input className="cc-form-control" type="number" name="position" min="1" step="1" value={input.position} onChange={change} required /></label>
            </div>
            <label className="block"><span className="cc-form-label">Description *</span><textarea className="cc-form-control min-h-40 resize-y" name="description" value={input.description} onChange={change} placeholder="Describe the team, impact, day-to-day work, and what success looks like…" required maxLength={12000} /></label>
            <label className="block"><span className="cc-form-label">Skills and qualifications</span><textarea className="cc-form-control min-h-24 resize-y" name="requirements" value={input.requirements} onChange={change} placeholder="Java, Spring Boot, SQL, REST APIs, communication" /><span className="text-[11px] text-slate-400 mt-1 block">Separate each skill or requirement with a comma.</span></label>
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={() => navigate("/admin/jobs")} className="cc-btn border border-slate-200 bg-white text-slate-600">Cancel</button><button disabled={loading} type="submit" className="cc-btn cc-btn-primary disabled:opacity-60">{loading ? "Publishing…" : "Publish job"} <Send size={15} /></button></div>
          </form>
        )}
      </main>
    </div>
  );
};

export default PostJob;

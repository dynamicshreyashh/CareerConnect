import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { JOB_API_END_POINT } from "@/utils/constants";

const initial = { title: "", description: "", requirements: "", salary: "", location: "", jobType: "Full-time", experienceLevel: "0", position: "1" };

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await axios.get(JOB_API_END_POINT + "/get/" + id);
        if (!response.data.success) throw new Error(response.data.message);
        const job = response.data.job;
        if (active) setInput({
          title: job.title || "",
          description: job.description || "",
          requirements: Array.isArray(job.requirements) ? job.requirements.join(", ") : job.requirements || "",
          salary: String(job.salary ?? ""),
          location: job.location || "",
          jobType: job.jobType || "Full-time",
          experienceLevel: String(job.experienceLevel ?? "0"),
          position: String(job.position ?? "1"),
        });
      } catch (error) {
        if (active) toast.error(error.response?.data?.message || error.message || "Unable to load this job.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [id]);

  const change = (event) => setInput((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await axios.put(JOB_API_END_POINT + "/" + id, {
        ...input,
        salary: Number(input.salary),
        experienceLevel: Number(input.experienceLevel),
        position: Number(input.position),
        requirements: input.requirements.split(",").map((item) => item.trim()).filter(Boolean),
      }, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message || "Job updated.");
        navigate("/admin/jobs", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="cc-content-width">
        <Link to="/admin/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 mb-6"><ArrowLeft size={16} /> Back to job postings</Link>
        <div className="cc-page-heading"><span className="cc-eyebrow">RECRUITER WORKSPACE</span><h1>Edit job posting</h1><p>Keep your role details clear and current so candidates know exactly what to expect.</p></div>
        {loading ? <div className="cc-empty-state">Loading job information…</div> : <form onSubmit={submit} className="cc-dashboard-card max-w-4xl space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <label><span className="cc-form-label">Job title *</span><input className="cc-form-control" name="title" value={input.title} onChange={change} required maxLength={120} /></label>
            <label><span className="cc-form-label">Location *</span><input className="cc-form-control" name="location" value={input.location} onChange={change} required placeholder="Pune / Remote / Hybrid" /></label>
            <label><span className="cc-form-label">Job type *</span><select className="cc-form-control" name="jobType" value={input.jobType} onChange={change} required>{["Full-time","Part-time","Internship","Contract","Remote","Hybrid"].map((type) => <option key={type}>{type}</option>)}</select></label>
            <label><span className="cc-form-label">Salary (LPA) *</span><input className="cc-form-control" type="number" name="salary" min="0" step="0.1" value={input.salary} onChange={change} required /></label>
            <label><span className="cc-form-label">Experience required (years) *</span><input className="cc-form-control" type="number" name="experienceLevel" min="0" step="0.5" value={input.experienceLevel} onChange={change} required /></label>
            <label><span className="cc-form-label">Number of openings *</span><input className="cc-form-control" type="number" name="position" min="1" step="1" value={input.position} onChange={change} required /></label>
          </div>
          <label className="block"><span className="cc-form-label">Job description *</span><textarea className="cc-form-control min-h-36 resize-y" name="description" value={input.description} onChange={change} required maxLength={12000} /></label>
          <label className="block"><span className="cc-form-label">Required skills / qualifications</span><textarea className="cc-form-control min-h-24 resize-y" name="requirements" value={input.requirements} onChange={change} placeholder="Java, REST APIs, SQL, communication" /><span className="text-[11px] text-slate-400 mt-1 block">Separate items with commas.</span></label>
          <div className="flex flex-wrap justify-end gap-3 border-t pt-5"><Button type="button" variant="outline" onClick={() => navigate("/admin/jobs")}>Cancel</Button><Button type="submit" disabled={saving} className="bg-violet-600 text-white hover:bg-violet-700">{saving ? "Saving…" : "Save changes"} <Save size={15} className="ml-2" /></Button></div>
        </form>}
      </main>
    </div>
  );
};

export default EditJob;

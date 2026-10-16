import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Building2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { COMPANY_API_END_POINT } from "@/utils/constants";

const empty = { name: "", description: "", website: "", location: "", file: null };

const CompanySetup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(empty);
  const [existingLogo, setExistingLogo] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await axios.get(COMPANY_API_END_POINT + "/get/" + id, { withCredentials: true });
        if (!response.data.success) throw new Error(response.data.message);
        const company = response.data.company;
        if (active) {
          setInput({ name: company.name || "", description: company.description || "", website: company.website || "", location: company.location || "", file: null });
          setExistingLogo(company.logo || "");
        }
      } catch (error) {
        if (active) toast.error(error.response?.data?.message || error.message || "Unable to load this company.");
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
    const data = new FormData();
    data.append("name", input.name.trim());
    data.append("description", input.description.trim());
    data.append("website", input.website.trim());
    data.append("location", input.location.trim());
    if (input.file) data.append("logo", input.file);
    try {
      const response = await axios.put(COMPANY_API_END_POINT + "/update/" + id, data, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message || "Company profile updated.");
        navigate("/admin/companies", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update company details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="cc-content-width">
        <Link to="/admin/companies" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 mb-6"><ArrowLeft size={16} /> Back to companies</Link>
        <div className="cc-page-heading"><span className="cc-eyebrow">RECRUITER WORKSPACE</span><h1>Build your company profile.</h1><p>A complete employer profile makes your job postings more trustworthy and recognizable to candidates.</p></div>
        {loading ? <div className="cc-empty-state">Loading company details…</div> : <form onSubmit={submit} className="cc-dashboard-card max-w-3xl space-y-5">
          <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            {input.file ? <img src={URL.createObjectURL(input.file)} alt="New company logo preview" className="w-16 h-16 rounded-xl border bg-white object-contain p-1" /> : existingLogo ? <img src={existingLogo} alt="Company logo" className="w-16 h-16 rounded-xl border bg-white object-contain p-1" /> : <div className="w-16 h-16 rounded-xl bg-violet-100 text-violet-600 grid place-items-center"><Building2 size={25} /></div>}
            <div className="flex-1"><strong className="block text-sm">Company logo</strong><p className="text-xs text-slate-500 mt-1">Use a clear square image (PNG, JPG, or WebP).</p><label className="inline-flex items-center gap-2 mt-3 text-xs font-bold text-violet-600 cursor-pointer hover:underline"><UploadCloud size={14} /> Choose logo<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => setInput((current) => ({ ...current, file: event.target.files?.[0] || null }))} /></label></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <label><span className="cc-form-label">Company name *</span><input className="cc-form-control" name="name" value={input.name} onChange={change} required maxLength={120} /></label>
            <label><span className="cc-form-label">Location</span><input className="cc-form-control" name="location" value={input.location} onChange={change} placeholder="Pune, India / Remote" /></label>
            <label className="md:col-span-2"><span className="cc-form-label">Website</span><input className="cc-form-control" type="url" name="website" value={input.website} onChange={change} placeholder="https://company.com" /></label>
            <label className="md:col-span-2"><span className="cc-form-label">About the company</span><textarea className="cc-form-control min-h-28 resize-y" name="description" value={input.description} onChange={change} placeholder="What does your team do? What should candidates know?" maxLength={4000} /></label>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" className="cc-btn border border-slate-200 bg-white text-slate-600" onClick={() => navigate("/admin/companies")}>Cancel</button><button type="submit" disabled={saving} className="cc-btn cc-btn-primary disabled:opacity-60">{saving ? "Saving…" : "Save company profile"}</button></div>
        </form>}
      </main>
    </div>
  );
};

export default CompanySetup;

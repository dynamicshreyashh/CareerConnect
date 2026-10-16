import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Building2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { COMPANY_API_END_POINT } from "@/utils/constants";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!companyName.trim()) return toast.error("Enter your company name.");
    setLoading(true);
    try {
      const response = await axios.post(COMPANY_API_END_POINT + "/register", { companyName: companyName.trim() }, { withCredentials: true });
      if (response.data.success) {
        dispatch(setSingleCompany(response.data.company));
        toast.success("Company created. Add a few details to finish its profile.");
        navigate("/admin/companies/" + response.data.company._id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create the company.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="cc-content-width">
        <Link to="/admin/companies" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 mb-6"><ArrowLeft size={16} /> Back to companies</Link>
        <div className="max-w-3xl mx-auto cc-dashboard-card !p-7 md:!p-10">
          <span className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 grid place-items-center"><Building2 size={25} /></span>
          <span className="cc-eyebrow mt-6">STEP 1 OF 2 · EMPLOYER PROFILE</span>
          <h1 className="font-extrabold text-3xl tracking-tight mt-2">Who are you hiring for?</h1>
          <p className="text-sm leading-7 text-slate-500 mt-3 max-w-xl">Add your company name to create an employer profile. You can add the logo, website, location, and description next. Job posts will be linked to this company identity.</p>
          <form onSubmit={submit} className="mt-7">
            <label htmlFor="companyName" className="cc-form-label">Company name</label>
            <input id="companyName" className="cc-form-control" value={companyName} onChange={(event) => setCompanyName(event.target.value)} required maxLength={120} placeholder="e.g. Acme Technologies" autoFocus />
            <div className="flex gap-3 mt-6"><button type="button" onClick={() => navigate("/admin/companies")} className="cc-btn border border-slate-200 bg-white text-slate-600">Cancel</button><button type="submit" disabled={loading} className="cc-btn cc-btn-primary disabled:opacity-60">{loading ? "Creating…" : "Continue to profile"} <ArrowRight size={16} /></button></div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CompanyCreate;

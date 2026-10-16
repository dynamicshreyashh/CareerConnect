import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BriefcaseBusiness, Edit3, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { JOB_API_END_POINT } from "@/utils/constants";
import { setAllAdminJobs } from "@/redux/jobSlice";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

  const filteredJobs = useMemo(() => (allAdminJobs || []).filter((job) => {
    const query = String(searchJobByText || "").toLowerCase().trim();
    return !query || [job.title, job.company?.name, job.location].filter(Boolean).join(" ").toLowerCase().includes(query);
  }), [allAdminJobs, searchJobByText]);

  const deleteJob = async (job) => {
    if (!window.confirm("Delete the " + job.title + " posting? All applications for this job will also be removed.")) return;
    setDeletingId(job._id);
    try {
      const response = await axios.delete(JOB_API_END_POINT + "/" + job._id, { withCredentials: true });
      if (response.data.success) {
        dispatch(setAllAdminJobs((allAdminJobs || []).filter((item) => item._id !== job._id)));
        toast.success("Job posting deleted.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete this job.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!filteredJobs.length) return <div className="cc-empty-state"><BriefcaseBusiness size={27} className="mx-auto mb-3 text-violet-500" /><strong className="block text-slate-800">{allAdminJobs.length ? "No postings match your search" : "Your first job starts here"}</strong><p className="mt-2 mb-4">{allAdminJobs.length ? "Try another job title or company." : "Create a company profile, then publish a job to start receiving applications."}</p>{!allAdminJobs.length && <button type="button" className="cc-btn cc-btn-primary" onClick={() => navigate("/admin/jobs/create")}>Post a job</button>}</div>;

  return (
    <div className="cc-table-scroll">
      <Table>
        <TableCaption>Your active job postings</TableCaption>
        <TableHeader><TableRow><TableHead>Company</TableHead><TableHead>Role</TableHead><TableHead>Location / type</TableHead><TableHead>Applicants</TableHead><TableHead>Posted</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {filteredJobs.map((job) => <TableRow key={job._id}>
            <TableCell><div className="flex items-center gap-2 min-w-32">{job.company?.logo ? <img src={job.company.logo} alt="" className="w-8 h-8 rounded-lg object-contain border p-1" /> : <span className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 grid place-items-center text-xs font-bold">{(job.company?.name || "C").slice(0,1).toUpperCase()}</span>}<span className="text-sm font-bold">{job.company?.name || "Company"}</span></div></TableCell>
            <TableCell><strong className="block text-sm">{job.title}</strong><span className="text-xs text-slate-500">{job.salary ? job.salary + " LPA" : "Salary not listed"}</span></TableCell>
            <TableCell><span className="block text-xs text-slate-700">{job.location || "Not specified"}</span><span className="text-xs text-slate-500">{job.jobType || "—"}</span></TableCell>
            <TableCell><span className="inline-flex min-w-8 justify-center rounded-full bg-violet-50 text-violet-700 px-2 py-1 text-xs font-bold">{job.applications?.length || 0}</span></TableCell>
            <TableCell className="text-xs text-slate-500">{job.createdAt ? new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</TableCell>
            <TableCell className="text-right"><Popover><PopoverTrigger asChild><button type="button" aria-label={"Actions for " + job.title} disabled={deletingId === job._id} className="p-2 rounded-lg border hover:bg-slate-50 disabled:opacity-50"><MoreHorizontal size={17} /></button></PopoverTrigger><PopoverContent className="w-44 p-1 bg-white shadow-xl rounded-xl z-50"><button className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs hover:bg-violet-50" type="button" onClick={() => navigate("/admin/jobs/" + job._id + "/applicants")}><Eye size={14} /> View applicants</button><button className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs hover:bg-violet-50" type="button" onClick={() => navigate("/admin/jobs/" + job._id + "/edit")}><Edit3 size={14} /> Edit posting</button><button className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50" type="button" onClick={() => deleteJob(job)}><Trash2 size={14} /> Delete posting</button></PopoverContent></Popover></TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;

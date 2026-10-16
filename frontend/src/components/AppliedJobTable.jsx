import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { useSelector } from "react-redux";

const prettyStatus = (status) => String(status || "pending").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
const statusClass = (status) => status === "accepted" || status === "shortlisted" ? "bg-emerald-50 text-emerald-700" : status === "rejected" ? "bg-rose-50 text-rose-700" : status === "interview" ? "bg-sky-50 text-sky-700" : "bg-amber-50 text-amber-800";

const AppliedJobTable = () => {
  const { allAppliedJobs = [] } = useSelector((store) => store.job);
  const navigate = useNavigate();
  if (!allAppliedJobs.length) return <div className="cc-empty-state"><BriefcaseBusiness size={26} className="mx-auto mb-3 text-violet-500" /><strong className="block text-slate-800">Your next opportunity is out there</strong><p className="mt-2 mb-4">Once you apply to a role, you can follow its status here.</p><button type="button" onClick={() => navigate("/jobs")} className="cc-btn cc-btn-primary">Explore open roles <ArrowUpRight size={15} /></button></div>;

  return (
    <div className="cc-table-scroll">
      <Table>
        <TableCaption>Your job application history</TableCaption>
        <TableHeader><TableRow><TableHead>Role / company</TableHead><TableHead>Applied on</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Details</TableHead></TableRow></TableHeader>
        <TableBody>
          {allAppliedJobs.map((application) => <TableRow key={application._id}>
            <TableCell><div><button type="button" className="text-left font-bold text-sm hover:text-violet-600" onClick={() => application.job?._id && navigate("/description/" + application.job._id)}>{application.job?.title || "Job no longer available"}</button><span className="block text-xs text-slate-500 mt-1">{application.job?.company?.name || "Company"}</span></div></TableCell>
            <TableCell className="text-xs text-slate-500">{application.createdAt ? new Date(application.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</TableCell>
            <TableCell><Badge className={"border-0 " + statusClass(application.status)}>{prettyStatus(application.status)}</Badge></TableCell>
            <TableCell className="text-right"><button type="button" title="View job details" disabled={!application.job?._id} onClick={() => navigate("/description/" + application.job._id)} className="inline-grid place-items-center rounded-lg border p-2 text-slate-500 hover:text-violet-600 disabled:opacity-40"><ArrowUpRight size={15} /></button></TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;

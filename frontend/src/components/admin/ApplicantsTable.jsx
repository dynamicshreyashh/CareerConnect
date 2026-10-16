import { useState } from "react";
import { MoreHorizontal, ExternalLink, Mail, Phone, Check } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constants";
import { setApplicant } from "@/redux/applicationSlice";
import { toast } from "sonner";

const statuses = ["pending", "under review", "shortlisted", "interview", "accepted", "rejected"];
const statusLabel = (value) => value ? value.split(" ").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ") : "Pending";

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const dispatch = useDispatch();
  const [updatingId, setUpdatingId] = useState(null);
  const applications = applicants?.applications || [];

  const statusHandler = async (status, id) => {
    setUpdatingId(id);
    try {
      const response = await axios.post(APPLICATION_API_END_POINT + "/status/" + id + "/update", { status }, { withCredentials: true });
      if (response.data.success) {
        dispatch(setApplicant({ ...applicants, applications: applications.map((application) => application._id === id ? { ...application, status: response.data.application.status } : application) }));
        toast.success("Candidate status updated.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update candidate status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!applications.length) return <div className="cc-empty-state"><div className="font-bold text-slate-800">No applications yet</div><p className="mt-2">When students apply to this role, their profiles and resumes will show up here.</p></div>;

  return (
    <div className="cc-table-scroll">
      <Table>
        <TableCaption>Applicants for your job posting</TableCaption>
        <TableHeader><TableRow><TableHead>Candidate</TableHead><TableHead>Contact</TableHead><TableHead>Resume</TableHead><TableHead>Applied</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Update</TableHead></TableRow></TableHeader>
        <TableBody>
          {applications.map((application) => {
            const person = application.applicant || {};
            const initials = person.fullName?.split(/\s+/).slice(0,2).map((part) => part[0]).join("").toUpperCase() || "ST";
            return <TableRow key={application._id}>
              <TableCell><div className="flex items-center gap-3 min-w-40"><span className="w-9 h-9 shrink-0 rounded-full bg-violet-50 text-violet-700 grid place-items-center font-bold text-xs">{initials}</span><div><strong className="block text-sm">{person.fullName || "Student"}</strong><span className="text-xs text-slate-500">{person.profile?.skills?.slice(0,3).join(" · ") || "Profile skills not added"}</span></div></div></TableCell>
              <TableCell><div className="space-y-1"><a className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-violet-600" href={person.email ? "mailto:" + person.email : undefined}><Mail size={12} />{person.email || "No email"}</a><span className="flex items-center gap-1.5 text-xs text-slate-500"><Phone size={12} />{person.phoneNumber || "No phone"}</span></div></TableCell>
              <TableCell>{person.profile?.resume ? <a className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:underline" href={person.profile.resume} target="_blank" rel="noreferrer">{person.profile.resumeOriginalName || "View resume"} <ExternalLink size={12} /></a> : <span className="text-xs text-slate-400">No resume</span>}</TableCell>
              <TableCell className="text-xs text-slate-500">{application.createdAt ? new Date(application.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</TableCell>
              <TableCell><span className={"inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize " + (application.status === "accepted" || application.status === "shortlisted" ? "bg-emerald-50 text-emerald-700" : application.status === "rejected" ? "bg-rose-50 text-rose-700" : application.status === "interview" ? "bg-sky-50 text-sky-700" : "bg-amber-50 text-amber-800")}>{statusLabel(application.status)}</span></TableCell>
              <TableCell className="text-right"><Popover><PopoverTrigger asChild><button type="button" disabled={updatingId === application._id} aria-label="Update application status" className="rounded-lg border p-2 hover:bg-slate-50 disabled:opacity-40"><MoreHorizontal size={17} /></button></PopoverTrigger><PopoverContent className="w-44 p-1 bg-white shadow-xl rounded-xl z-50"><div className="text-[10px] text-slate-400 uppercase tracking-wide font-bold px-2 py-2">Set candidate status</div>{statuses.map((status) => <button key={status} type="button" disabled={status === application.status || updatingId === application._id} onClick={() => statusHandler(status, application._id)} className="flex items-center justify-between w-full rounded-lg px-2 py-2 text-xs capitalize text-left hover:bg-violet-50 disabled:text-slate-300"><span>{statusLabel(status)}</span>{status === application.status && <Check size={13} />}</button>)}</PopoverContent></Popover></TableCell>
            </TableRow>;
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;

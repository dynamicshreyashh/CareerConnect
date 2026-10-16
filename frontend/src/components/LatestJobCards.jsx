import { ArrowUpRight, MapPin, BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const companyName = job?.company?.name || "Hiring company";
  const initials = companyName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return (
    <article className="cc-job-card" onClick={() => navigate(`/description/${job._id}`)} onKeyDown={(event) => event.key === "Enter" && navigate(`/description/${job._id}`)} role="link" tabIndex={0}>
      <div className="cc-job-card-head">
        {job?.company?.logo ? <img className="cc-company-logo" src={job.company.logo} alt={`${companyName} logo`} /> : <span className="cc-company-logo cc-company-initials">{initials || <BriefcaseBusiness size={20} />}</span>}
        <span className="cc-job-new">Recently posted</span>
      </div>
      <p className="cc-job-company">{companyName}</p>
      <h3>{job?.title || "Open position"}</h3>
      <p className="cc-job-description">{job?.description || "Explore this opportunity and see whether it is the right next step for you."}</p>
      <div className="cc-job-meta"><span><MapPin size={14} /> {job?.location || "Location flexible"}</span><span><BriefcaseBusiness size={14} /> {job?.jobType || "Full-time"}</span></div>
      <div className="cc-job-card-footer"><span>{job?.salary ? `₹${Number(job.salary).toLocaleString("en-IN")} LPA` : "Compensation shared in details"}{job?.position ? <small>{job.position} opening{job.position === 1 ? "" : "s"}</small> : null}</span><span className="cc-job-arrow"><ArrowUpRight size={19} /></span></div>
    </article>
  );
};

export default LatestJobCards;

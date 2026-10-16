import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LatestJobCards from "./LatestJobCards";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();

  return (
    <section className="cc-latest">
      <div className="cc-latest-top">
        <div><span className="cc-eyebrow">THE LATEST OPENINGS</span><h2>Good work is <span>out there.</span></h2><p>Explore a few of the newest opportunities added to CareerConnect.</p></div>
        <button type="button" onClick={() => navigate("/jobs")} className="cc-link-button">Explore all jobs <ArrowRight size={17} /></button>
      </div>
      {allJobs.length ? (
        <div className="cc-job-grid">{allJobs.slice(0, 6).map((job) => <LatestJobCards key={job._id} job={job} />)}</div>
      ) : (
        <div className="cc-empty-jobs"><span><BriefcaseBusiness size={24} /></span><strong>Great opportunities are on their way.</strong><p>Job listings will appear here as soon as recruiters publish them.</p></div>
      )}
    </section>
  );
};

export default LatestJobs;

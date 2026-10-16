import { Link } from "react-router-dom";
import { BriefcaseBusiness, ArrowUpRight } from "lucide-react";

const Footer = () => (
  <footer className="cc-footer">
    <div className="cc-footer-inner">
      <div className="cc-footer-brand">
        <Link className="cc-logo" to="/" aria-label="CareerConnect home"><span className="cc-logo-mark">C</span><span className="cc-logo-text">Career<span>Connect</span></span></Link>
        <p className="cc-footer-copy">A more considered way to find your next opportunity. Explore roles, manage applications, and keep your career moving forward.</p>
      </div>
      <div className="cc-footer-col"><h3>For candidates</h3><div className="cc-footer-links"><Link to="/jobs">Find a job</Link><Link to="/browse">Explore opportunities</Link><Link to="/profile">Track applications</Link><Link to="/signup">Create an account</Link></div></div>
      <div className="cc-footer-col"><h3>For recruiters</h3><div className="cc-footer-links"><Link to="/signup">Join as a recruiter</Link><Link to="/admin/companies">Company workspace</Link><Link to="/admin/jobs/create">Post a job <ArrowUpRight size={13} style={{ display: "inline", verticalAlign: "middle" }} /></Link><span>Built to connect talent with possibility.</span></div></div>
    </div>
    <div className="cc-footer-bottom"><span>© {new Date().getFullYear()} CareerConnect. Built for the next generation of work.</span><span><BriefcaseBusiness size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} /> Discover. Apply. Grow.</span></div>
  </footer>
);

export default Footer;

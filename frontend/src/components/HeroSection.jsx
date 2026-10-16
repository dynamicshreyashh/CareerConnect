import { useState } from "react";
import { ArrowRight, Search, Sparkles, MapPin, BriefcaseBusiness, ShieldCheck } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchHandler = (event) => {
    event?.preventDefault();
    dispatch(setSearchedQuery(query.trim()));
    navigate("/browse");
  };

  return (
    <section className="cc-hero">
      <div className="cc-hero-glow cc-glow-one" aria-hidden="true" />
      <div className="cc-hero-glow cc-glow-two" aria-hidden="true" />
      <div className="cc-hero-inner">
        <div className="cc-hero-copy">
          <div className="cc-pill"><Sparkles size={15} /> Your next chapter starts here</div>
          <h1>Find work that<br />moves you <span>forward.</span></h1>
          <p className="cc-hero-subtitle">Discover opportunities built around your skills, ambitions, and the life you want to build.</p>
          <form className="cc-search" onSubmit={searchHandler}>
            <Search size={20} className="cc-search-icon" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search jobs" placeholder="Job title, skill, or company" />
            <button className="cc-btn cc-btn-primary" type="submit">Search jobs <ArrowRight size={16} /></button>
          </form>
          <div className="cc-search-hints"><span>Popular:</span>{["Software Engineer", "Product", "Data", "Internship"].map((item) => <button key={item} type="button" onClick={() => { setQuery(item); dispatch(setSearchedQuery(item)); navigate("/browse"); }}>{item}</button>)}</div>
          <div className="cc-hero-trust"><span><ShieldCheck size={16} /> Verified recruiter accounts</span><span><BriefcaseBusiness size={16} /> Opportunities in one place</span></div>
        </div>
        <div className="cc-hero-art" aria-label="Career opportunity dashboard illustration">
          <div className="cc-art-orbit cc-orbit-back" />
          <div className="cc-art-orbit cc-orbit-front" />
          <div className="cc-art-spark cc-spark-a">✳</div><div className="cc-art-spark cc-spark-b">✦</div>
          <div className="cc-art-panel">
            <div className="cc-art-panel-top"><div><span className="cc-art-label">YOUR CAREER, IN FOCUS</span><h3>Opportunities<br />worth exploring.</h3></div><span className="cc-art-icon"><BriefcaseBusiness size={20} /></span></div>
            <div className="cc-art-mini-card"><span className="cc-company-mark cc-mark-violet">N</span><div className="cc-art-job"><strong>Software Engineer</strong><small>Nova Labs · Pune, India</small></div><span className="cc-art-match">Great fit</span></div>
            <div className="cc-art-mini-card"><span className="cc-company-mark cc-mark-green">A</span><div className="cc-art-job"><strong>Backend Developer</strong><small>Arc Systems · Hybrid</small></div><span className="cc-art-match">New</span></div>
            <div className="cc-art-mini-card"><span className="cc-company-mark cc-mark-orange">F</span><div className="cc-art-job"><strong>Graduate Trainee</strong><small>Foundry Tech · Remote</small></div><span className="cc-art-match">Open</span></div>
            <div className="cc-art-panel-foot"><span><span className="cc-status-dot" /> Your next step is closer</span><span className="cc-foot-arrow">↗</span></div>
          </div>
          <div className="cc-floating-card cc-floating-top"><span className="cc-floating-check">✓</span><span><strong>Application sent</strong><small>You're on your way</small></span></div>
          <div className="cc-floating-card cc-floating-bottom"><span className="cc-floating-location"><MapPin size={17} /></span><span><strong>Find your fit</strong><small>Roles that match you</small></span></div>
        </div>
      </div>
      <div className="cc-hero-bottom"><span>YOUR CAREER JOURNEY, SIMPLIFIED</span><div><span>Discover</span><i /> <span>Apply</span><i /> <span>Grow</span></div></div>
    </section>
  );
};

export default HeroSection;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategeoryCarousel from "./CategeoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Home = () => {
  useGetAllJobs();
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "recruiter") navigate("/admin/companies", { replace: true });
  }, [user, navigate]);

  return (
    <div className="cc-page">
      <Navbar />
      <main>
        <HeroSection />
        <CategeoryCarousel />
        <LatestJobs />
        <section className="cc-how">
          <div className="cc-section-head">
            <span className="cc-eyebrow">MADE FOR YOUR NEXT MOVE</span>
            <h2>Less searching. <span>More growing.</span></h2>
            <p>One focused place to discover roles, apply with confidence, and keep every opportunity organized.</p>
          </div>
          <div className="cc-steps">
            <article className="cc-step"><span className="cc-step-number">01</span><h3>Discover your fit</h3><p>Search relevant roles by skill, location, and work style without losing track of the good ones.</p></article>
            <article className="cc-step"><span className="cc-step-number">02</span><h3>Apply with clarity</h3><p>Keep your profile and resume in one place, then submit an application in a few clicks.</p></article>
            <article className="cc-step"><span className="cc-step-number">03</span><h3>Know where you stand</h3><p>Follow your application status while recruiters review candidates in a structured pipeline.</p></article>
          </div>
        </section>
        <section className="cc-recruiter-cta">
          <div><span className="cc-eyebrow cc-eyebrow-light">FOR RECRUITERS</span><h2>Meet the people behind the potential.</h2><p>Publish openings, review applicants, and move the right candidates forward from one workspace.</p></div>
          <button type="button" onClick={() => navigate(user ? "/admin/jobs/create" : "/signup")} className="cc-btn cc-btn-light">{user?.role === "recruiter" ? "Post a job" : "Create a recruiter account"} <span aria-hidden="true">↗</span></button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

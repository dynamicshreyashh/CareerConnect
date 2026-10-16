import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Menu, X, LogOut, UserRound, Bookmark, ClipboardList, Building2, BriefcaseBusiness } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constants";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = user?.fullName?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "CC";
  const isRecruiter = user?.role === "recruiter";
  const links = isRecruiter
    ? [{ to: "/admin/companies", label: "Companies" }, { to: "/admin/jobs", label: "Job postings" }]
    : [{ to: "/", label: "Home" }, { to: "/jobs", label: "Find jobs" }, { to: "/browse", label: "Explore" }];
  const closeMobile = () => setMobileOpen(false);

  const logoutHandler = async () => {
    try {
      await axios.post(USER_API_END_POINT + "/logout", {}, { withCredentials: true });
      dispatch(setUser(null));
      navigate("/", { replace: true });
      toast.success("You have been signed out.");
      closeMobile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to sign out. Please try again.");
    }
  };

  const navLinkClass = (to) => location.pathname === to ? "active" : "";
  return (
    <header className="cc-navbar">
      <div className="cc-nav-inner">
        <Link className="cc-logo" to="/" aria-label="CareerConnect home" onClick={closeMobile}>
          <span className="cc-logo-mark">C</span><span className="cc-logo-text">Career<span>Connect</span></span>
        </Link>
        <nav aria-label="Main navigation" className="cc-nav-links">
          {links.map((link) => <Link className={navLinkClass(link.to)} key={link.to} to={link.to}>{link.label}</Link>)}
        </nav>
        <div className="cc-nav-actions">
          {!user ? (
            <><Link className="cc-nav-login" to="/login">Sign in</Link><Link className="cc-btn cc-btn-primary cc-nav-signup" to="/signup">Get started <span aria-hidden="true">↗</span></Link></>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <button className="cc-nav-user" type="button" aria-label="Open account menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profile?.profilePhoto} alt="" />
                    <AvatarFallback className="bg-violet-100 text-violet-700 text-xs font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <span>{user?.fullName?.split(" ")[0] || "Account"}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3 bg-white shadow-xl rounded-2xl border z-50">
                <div className="px-2 py-2 border-b mb-2"><strong className="block text-sm">{user.fullName}</strong><span className="block text-xs text-gray-500 mt-1">{user.email}</span><span className="inline-flex mt-2 rounded-full bg-violet-50 text-violet-700 px-2 py-1 text-[10px] font-bold capitalize">{user.role} account</span></div>
                {user.role === "student" ? <>
                  <Link className="flex gap-2 items-center rounded-lg px-3 py-2 text-sm hover:bg-slate-50" to="/profile"><UserRound size={16} /> My profile</Link>
                  <Link className="flex gap-2 items-center rounded-lg px-3 py-2 text-sm hover:bg-slate-50" to="/profile"><ClipboardList size={16} /> Applications</Link>
                  <Link className="flex gap-2 items-center rounded-lg px-3 py-2 text-sm hover:bg-slate-50" to="/saved-jobs"><Bookmark size={16} /> Saved jobs</Link>
                </> : <>
                  <Link className="flex gap-2 items-center rounded-lg px-3 py-2 text-sm hover:bg-slate-50" to="/admin/companies"><Building2 size={16} /> Manage companies</Link>
                  <Link className="flex gap-2 items-center rounded-lg px-3 py-2 text-sm hover:bg-slate-50" to="/admin/jobs"><BriefcaseBusiness size={16} /> Manage jobs</Link>
                </>}
                <button type="button" onClick={logoutHandler} className="flex w-full gap-2 items-center rounded-lg px-3 py-2 mt-2 border-t pt-3 text-sm text-rose-600 hover:bg-rose-50"><LogOut size={16} /> Sign out</button>
              </PopoverContent>
            </Popover>
          )}
        </div>
        <button type="button" className="cc-nav-mobile-toggle" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label={mobileOpen ? "Close menu" : "Open menu"}>
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {mobileOpen && <nav className="cc-mobile-menu" aria-label="Mobile navigation">
        {links.map((link) => <Link key={link.to} to={link.to} onClick={closeMobile}>{link.label}</Link>)}
        {user?.role === "student" && <><Link to="/profile" onClick={closeMobile}>My profile & applications</Link><Link to="/saved-jobs" onClick={closeMobile}>Saved jobs</Link></>}
        {user?.role === "recruiter" && <Link to="/admin/jobs/create" onClick={closeMobile}>Post a job</Link>}
        <div className="cc-mobile-actions">
          {!user ? <><Link className="cc-btn cc-btn-primary" to="/login" onClick={closeMobile}>Sign in</Link><Link className="cc-btn" style={{ background: "#f0efff", color: "#5849c6" }} to="/signup" onClick={closeMobile}>Create account</Link></> : <button className="cc-btn" style={{ background: "#fff0f0", color: "#b83b53" }} type="button" onClick={logoutHandler}><LogOut size={15} /> Sign out</button>}
        </div>
      </nav>}
    </header>
  );
};

export default Navbar;

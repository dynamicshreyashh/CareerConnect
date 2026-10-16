import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, UploadCloud } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/utils/constants";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";

const UpdateProfileDailog = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({ fullName: "", email: "", phoneNumber: "", bio: "", skills: "", file: null });

  useEffect(() => {
    if (open && user) setInput({
      fullName: user.fullName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      bio: user.profile?.bio || "",
      skills: (user.profile?.skills || []).join(", "),
      file: null,
    });
  }, [open, user]);

  const change = (event) => setInput((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("fullName", input.fullName.trim());
    data.append("email", input.email.trim());
    data.append("phoneNumber", input.phoneNumber.trim());
    data.append("bio", input.bio.trim());
    data.append("skills", input.skills);
    if (input.file) data.append("file", input.file);

    setLoading(true);
    try {
      const response = await axios.post(USER_API_END_POINT + "/profile/update", data, { withCredentials: true });
      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message || "Profile updated.");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white text-slate-900 sm:max-w-[540px]">
        <DialogHeader><DialogTitle className="text-xl font-extrabold">Update your profile</DialogTitle><p className="text-sm text-slate-500">Help recruiters understand your experience and strengths.</p></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label htmlFor="profile-fullname" className="cc-form-label">Full name</Label><Input id="profile-fullname" name="fullName" value={input.fullName} onChange={change} required maxLength={100} /></div>
            <div><Label htmlFor="profile-phone" className="cc-form-label">Phone number</Label><Input id="profile-phone" name="phoneNumber" value={input.phoneNumber} onChange={change} required /></div>
            <div className="sm:col-span-2"><Label htmlFor="profile-email" className="cc-form-label">Email address</Label><Input id="profile-email" name="email" type="email" value={input.email} onChange={change} required /></div>
            <div className="sm:col-span-2"><Label htmlFor="profile-bio" className="cc-form-label">Professional summary</Label><textarea id="profile-bio" name="bio" value={input.bio} onChange={change} className="cc-form-control min-h-24 resize-y" maxLength={1000} placeholder="A short introduction about your focus and goals" /></div>
            <div className="sm:col-span-2"><Label htmlFor="profile-skills" className="cc-form-label">Skills</Label><Input id="profile-skills" name="skills" value={input.skills} onChange={change} placeholder="Java, Spring Boot, SQL, REST APIs" /><p className="text-[11px] text-slate-400 mt-1">Separate each skill with a comma.</p></div>
            <div className="sm:col-span-2"><Label htmlFor="profile-resume" className="cc-form-label">Upload resume or profile image <span className="font-normal text-slate-400">(optional)</span></Label><label className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 p-3 hover:border-violet-400 cursor-pointer"><UploadCloud size={19} className="text-violet-600" /><span className="flex-1 min-w-0"><strong className="block text-xs truncate">{input.file?.name || user?.profile?.resumeOriginalName || "Choose a PDF, Word document, or image"}</strong><small className="block text-[10px] text-slate-400 mt-1">Maximum 10 MB</small></span><input id="profile-resume" className="sr-only" type="file" accept=".pdf,.doc,.docx,image/png,image/jpeg,image/webp" onChange={(event) => setInput((current) => ({ ...current, file: event.target.files?.[0] || null }))} /></label></div>
          </div>
          <DialogFooter className="gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={loading} className="bg-violet-600 text-white hover:bg-violet-700">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : "Save profile"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDailog;

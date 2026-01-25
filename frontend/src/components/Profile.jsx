import React, { useState, useEffect } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Ghost, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDailog from "./UpdateProfileDailog";
import { useDispatch, useSelector } from "react-redux";
import { setIsResume } from "@/redux/authSlice";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user, isResume } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Set resume status
  useEffect(() => {
    if (user?.profile?.resume) {
      dispatch(setIsResume(true));
    }
  }, [user, dispatch]);

  // Show loading or redirect if no user
  if (!user) {
    return null;
  }

  // Get user initials for fallback
  const getUserInitials = (fullName) => {
    if (!fullName) return "U";
    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto border border-gray-400 bg-white rounded-2xl my-5 p-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user?.profile?.profilePhoto}
                alt={user?.fullName || "User"}
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="bg-purple-600 text-white font-semibold text-2xl">
                {getUserInitials(user?.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{user?.fullName || "User"}</h1>
              <p className="text-sm">{user?.profile?.bio || "No bio added"}</p>
            </div>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="text-white text-right bg-black"
            variant="outline"
          >
            <Pen></Pen>
          </Button>
        </div>
        <div className="my-5">
          <div className="flex items-center gap-2 my-2">
            <Mail />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Contact />
            <span>{user?.phoneNumber}</span>
          </div>
        </div>
        <div className="my-5">
          <h1>Skills</h1>
          <div className="flex items-center gap-1 flex-wrap">
            {user?.profile?.skills && user?.profile?.skills.length > 0 ? (
              user.profile.skills.map((item, index) => (
                <Badge
                  className="bg-black text-white"
                  variant={Ghost}
                  key={index}
                >
                  {item}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500">No skills added</span>
            )}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-lg font-bold">Resume</Label>
          {isResume ? (
            <a
              target="_blank"
              href={user?.profile?.resume}
              className="text-blue-500 w-full hover:underline cursor-pointer "
            >
              {user?.profile?.resumeOriginalName}
            </a>
          ) : (
            <span>No Resume Uploaded</span>
          )}
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 my-5">
        <h1 className="text-2xl font-bold mb-4">Applied Jobs</h1>
        <AppliedJobTable />
      </div>
      <Footer />
      <UpdateProfileDailog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;

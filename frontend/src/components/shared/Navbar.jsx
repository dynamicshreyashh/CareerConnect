import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constants";
import { setUser } from "@/redux/authSlice";

const Navbar = () => {
  // const user = true;
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user initials for fallback
  const getUserInitials = (fullName) => {
    if (!fullName) return "U";
    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <div>
          <h1 className="text-3xl font-bold">
            Career<span className="text-red-500">Connect</span>
          </h1>
        </div>
        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            {user && user?.role == "recruiter" ? (
              <>
                <li>
                  <Link to={"/admin/companies"}>Companies</Link>
                </li>
                <li>
                  <Link to={"/admin/jobs"}>Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to={"/"}>Home</Link>
                </li>
                <li>
                  <Link to={"/jobs"}>Jobs</Link>
                </li>
                <li>
                  <Link to={"/browse"}>Browse</Link>
                </li>
              </>
            )}
          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                {" "}
                <Button className="bg-[#6A38C2] rounded-lg hover:bg-[#5b2bd9]">
                  SignUp
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-gray-100 rounded-full px-3 py-2"
                  >
                    <Avatar className="cursor-pointer w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-200">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={user?.fullName || "User"}
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback className="bg-purple-600 text-white font-semibold text-sm">
                        {getUserInitials(user?.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block font-medium text-gray-700">
                      {user?.fullName}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 bg-white rounded-lg shadow-lg border flex flex-col gap-3 z-50">
                  <div className="flex gap-3 items-center">
                    <Avatar className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-200">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={user?.fullName || "User"}
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback className="bg-purple-600 text-white font-semibold text-lg">
                        {getUserInitials(user?.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-lg">{user?.fullName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                      {user?.profile?.bio && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {user?.profile?.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="border-t pt-3 mt-2 space-y-1">
                    {user && user?.role === "student" && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 hover:bg-gray-100"
                        asChild
                      >
                        <Link to={"/profile"}>
                          <User2 className="w-4 h-4" />
                          View Profile
                        </Link>
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 hover:bg-red-50 hover:text-red-600 text-red-600"
                      onClick={logoutHandler}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

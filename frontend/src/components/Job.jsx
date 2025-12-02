import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constants";
import { toast } from "sonner";

const Job = ({ job }) => {
  const navigate = useNavigate();

  const daysAgo = (dateString) => {
    if (!dateString) return "Today";
    const createdAt = new Date(dateString);
    const now = new Date();
    const diff = now - createdAt;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (isNaN(days)) return "Today";
    if (days === 0) return "Today";
    return `${days} days ago`;
  };

  const saveJob = async () => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/save-job/${job._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Job saved for later");
      } else {
        toast.error(res.data.message || "Failed to save job");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save job");
    }
  };

  return (
    <div className="p-5 rounded-md bg-white border shadow-sm hover:shadow-md transition-all">
      {/* top row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{daysAgo(job?.createdAt)}</p>

        <Button
          onClick={saveJob}
          className="rounded-full"
          size="icon"
          variant="outline"
        >
          <Bookmark />
        </Button>
      </div>

      {/* company */}
      <div className="flex items-center gap-4 my-4">
        <Avatar>
          <AvatarImage
            className="object-cover"
            src={job?.company?.logo}
            alt={job?.company?.name || "Company logo"}
          />
        </Avatar>
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">{job?.location}</p>
        </div>
      </div>

      {/* title + short desc */}
      <h1 className="font-bold text-lg">{job?.title}</h1>
      <p className="text-sm text-gray-600 mt-2">
        {job?.description?.length > 120
          ? job.description.slice(0, 120) + "..."
          : job?.description}
      </p>

      {/* tags */}
      <div className="flex gap-2 mt-4 flex-wrap">
        <Badge variant="ghost" className="text-blue-700 font-bold">
          {job?.position} Positions
        </Badge>
        <Badge variant="ghost" className="text-red-600 font-bold">
          {job?.jobType}
        </Badge>
        <Badge variant="ghost" className="text-purple-700 font-bold">
          {job?.salary} LPA
        </Badge>
      </div>

      {/* actions */}
      <div className="flex gap-3 mt-6">
        <Button
          onClick={() => navigate(`/description/${job._id}`)}
          className="w-full bg-black text-white"
        >
          Details
        </Button>
        <Button
          onClick={saveJob}
          variant="outline"
          className="w-full bg-purple-700 text-white"
        >
          Save For Later
        </Button>
      </div>
    </div>
  );
};

export default Job;

import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { setSingleJob } from "@/redux/jobSlice";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
  USER_API_END_POINT,
} from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const JobDescription = () => {
  const navigate = useNavigate();
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const saveJob = async () => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/save-job/${jobId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Job saved!");
      } else {
        toast.error(res.data.message || "Unable to save job");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to save job");
    }
  };

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsApplied(true);
        dispatch(
          setSingleJob({
            ...singleJob,
            applications: [
              ...(singleJob?.applications || []),
              { applicant: user?._id },
            ],
          })
        );
        toast.success("Successfully applied!");
      } else {
        toast.error(res.data.message || "Failed to apply");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to apply");
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job?.applications?.some(
              (app) => app.applicant === user?._id
            )
          );
        } else {
          setLoadError(res.data.message || "Unable to load job details");
        }
      } catch (error) {
        console.error(error);
        setLoadError(
          error.response?.data?.message || "Unable to load job details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, dispatch, user?._id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto my-10">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="mr-2" /> Back
        </Button>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (loadError || !singleJob) {
    return (
      <div className="max-w-7xl mx-auto my-10">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="mr-2" /> Back
        </Button>
        <p className="text-red-500">
          {loadError || "Job not found or you are not authorized."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-10">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        variant="outline"
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft /> Back
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">{singleJob?.title}</h1>
          <div className="flex gap-2 mt-2">
            <Badge>{singleJob?.position} Positions</Badge>
            <Badge>{singleJob?.jobType}</Badge>
            <Badge>{singleJob?.salary} LPA</Badge>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={saveJob}
            variant="outline"
            className="bg-purple-600 text-white"
          >
            Save Job
          </Button>

          <Button
            onClick={!isApplied ? applyJobHandler : null}
            disabled={isApplied}
            className={`text-white ${
              isApplied ? "bg-gray-500" : "bg-purple-700"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </Button>
        </div>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3 my-6">
        <img
          src={singleJob?.company?.logo}
          alt="Company Logo"
          className="w-16 h-16 rounded-full border object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold">{singleJob?.company?.name}</h2>
          <p className="text-gray-600">{singleJob?.location}</p>
        </div>
      </div>

      <h1 className="border-b pb-4 font-semibold text-lg">Job Description</h1>

      <div className="my-4 space-y-3 text-gray-700">
        <p>
          <b>Role:</b> {singleJob?.title}
        </p>
        <p>
          <b>Description:</b> {singleJob?.description}
        </p>
        <p>
          <b>Experience:</b> {singleJob?.experienceLevel} years
        </p>
        <p>
          <b>Salary:</b> {singleJob?.salary} LPA
        </p>
        <p>
          <b>Total Applicants:</b> {singleJob?.applications?.length || 0}</p>
        <p>
          <b>Posted On:</b>{" "}
          {singleJob?.createdAt ? singleJob.createdAt.split("T")[0] : ""}
        </p>
      </div>
    </div>
  );
};

export default JobDescription;

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constants";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    let active = true;
    const fetchApplications = async () => {
      try {
        const response = await axios.get(APPLICATION_API_END_POINT + "/get", { withCredentials: true });
        if (active && response.data.success) dispatch(setAllAppliedJobs(response.data.application || []));
      } catch (error) {
        if (active) {
          dispatch(setAllAppliedJobs([]));
          if (error.response?.status !== 401) toast.error(error.response?.data?.message || "Unable to load your applications.");
        }
      }
    };
    fetchApplications();
    return () => { active = false; };
  }, [dispatch]);
};

export default useGetAppliedJobs;

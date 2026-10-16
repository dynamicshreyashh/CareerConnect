import { useEffect } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constants";
import { useDispatch } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice";

const useGetAllJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;
    const fetchAllJobs = async () => {
      try {
        const response = await axios.get(`${JOB_API_END_POINT}/get`);
        if (active && response.data.success) dispatch(setAllJobs(response.data.jobs || []));
      } catch (error) {
        if (active) {
          console.error("Unable to load jobs:", error.response?.data?.message || error.message);
          dispatch(setAllJobs([]));
        }
      }
    };
    fetchAllJobs();
    return () => { active = false; };
  }, [dispatch]);
};

export default useGetAllJobs;

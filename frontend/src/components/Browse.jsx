import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import Footer from "./shared/Footer";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10">
        <h1 className="font-bold text-xl my-5">
          Search result ({allJobs.length})
        </h1>
        {allJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allJobs.map((job) => {
              return <Job key={job._id} job={job} />;
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Browse;

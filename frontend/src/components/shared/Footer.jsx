import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div>
            <h1 className="text-2xl font-bold">
              Career<span className="text-red-500">Connect</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Connecting talent with opportunity
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm">
            <Link to="/jobs" className="text-gray-400 hover:text-white">
              Jobs
            </Link>
            <Link to="/browse" className="text-gray-400 hover:text-white">
              Browse
            </Link>
            <Link to="/login" className="text-gray-400 hover:text-white">
              Login
            </Link>
            <Link to="/signup" className="text-gray-400 hover:text-white">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} CareerConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
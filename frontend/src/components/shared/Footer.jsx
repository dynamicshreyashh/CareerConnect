import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Users, Globe, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">
                Career<span className="text-blue-400">Connect</span>
              </h1>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Your gateway to dream jobs, seamless hiring, and unlocking endless 
              career opportunities worldwide. Connecting talent with opportunity.
            </p>
            
            {/* Stats */}
            <div className="flex gap-6 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">10K+</div>
                <div className="text-sm text-gray-400">Jobs Posted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">5K+</div>
                <div className="text-sm text-gray-400">Hired</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">500+</div>
                <div className="text-sm text-gray-400">Companies</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              For Job Seekers
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/jobs" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  Companies
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-400" />
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/signup" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-green-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  Create Account
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-green-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  Sign In
                </Link>
              </li>
              <li>
                <a 
                  href="#support" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-green-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links & Contact */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex gap-6">
              <a
                href="https://x.com/ShreyBhosale"
                rel="noreferrer"
                target="_blank"
                className="group p-3 bg-gray-800 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                title="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>

              <a
                href="https://github.com/dynamicshreyashh"
                rel="noreferrer"
                target="_blank"
                className="group p-3 bg-gray-800 rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
                title="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/shreyash-5a7726245/"
                rel="noreferrer"
                target="_blank"
                className="group p-3 bg-gray-800 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
                title="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.23 0H1.77A1.77 1.77 0 000 1.77v20.46C0 23.39.61 24 1.77 24h20.46A1.77 1.77 0 0024 22.23V1.77A1.77 1.77 0 0022.23 0zM7.06 20.45H3.56V9h3.5v11.45zM5.31 7.5a2.03 2.03 0 01-2.03-2.03 2.03 2.03 0 112.03 2.03zM20.45 20.45h-3.5v-5.9c0-1.41-.03-3.23-1.97-3.23-1.97 0-2.27 1.54-2.27 3.13v6h-3.5V9h3.36v1.56h.05c.47-.88 1.62-1.8 3.34-1.8 3.57 0 4.23 2.35 4.23 5.4v6.29z" />
                </svg>
              </a>

              <a
                href="mailto:contact@careerconnect.com"
                className="group p-3 bg-gray-800 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            {/* Newsletter */}
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-sm">Stay updated with job alerts</span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} CareerConnect. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
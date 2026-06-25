import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, MapPin, ArrowRight, Briefcase, Users, Zap } from "lucide-react";

const Home = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const popularSearches = [
    "React Developer",
    "Node.js",
    "Full-stack",
    "DevOps",
    "Graduate",
    "TypeScript",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <p className="text-xs font-mono text-blue-600 tracking-wide mb-4">
          // find your next role
        </p>
        <h1
          className="text-5xl font-semibold text-slate-900 leading-tight mb-4 max-w-2xl"
          style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-1px" }}
        >
          Find work that fits who you actually are.
        </h1>
        <p className="text-slate-500 text-lg mb-10 max-w-lg">
          Junior, mid, senior — tech roles across Australia and beyond.
        </p>

        {/* Search Bar */}
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden max-w-2xl shadow-sm">
          <div className="flex items-center gap-3 flex-1 px-4">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Job title, skill, or company"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full py-3.5 text-sm outline-none bg-transparent text-slate-800 placeholder-slate-400"
            />
          </div>
          <div className="w-px h-7 bg-slate-200" />
          <div className="flex items-center gap-3 px-4" style={{ minWidth: "170px" }}>
            <MapPin size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Anywhere"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full py-3.5 text-sm outline-none bg-transparent text-slate-800 placeholder-slate-400"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3.5 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>

        {/* Popular Searches */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-xs text-slate-400">Popular:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => navigate(`/jobs?q=${term}`)}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="border-y border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Briefcase size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>1,200+</p>
              <p className="text-sm text-slate-500">active roles</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>340+</p>
              <p className="text-sm text-slate-500">companies hiring</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Zap size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>89%</p>
              <p className="text-sm text-slate-500">respond in 48 hrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
            Recent listings
          </h2>
          <Link
            to="/jobs"
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <RecentJobs />
      </div>
    </div>
  );
};

const RecentJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useState(() => {
    fetch(`${API_URL}/jobs`)
      .then((r) => r.json())
      .then((data) => {
        setJobs(data.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  });

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">No jobs posted yet.</p>
        <Link to="/post-job" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
          Be the first to post one →
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
      {jobs.map((job) => (
        <div
          key={job.id}
          onClick={() => navigate(`/jobs/${job.id}`)}
          className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-medium text-slate-500 shrink-0">
            {job.company?.slice(0, 2).toUpperCase() || "JB"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate" style={{ fontFamily: "'Sora', sans-serif" }}>
              {job.title}
            </p>
            <p className="text-xs text-blue-600 mt-0.5">{job.company || "Company"}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono text-slate-400">
              {new Date(job.created_at).toLocaleDateString("en-AU")}
            </span>
            <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;

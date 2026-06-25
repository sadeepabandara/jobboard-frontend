import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, MapPin, Briefcase, SlidersHorizontal, X } from "lucide-react";

interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  user_id: number;
  created_at: string;
}

const timeAgo = (dateStr: string) => {
  const now = new Date();
  const diff = now.getTime() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days}d ago`;
};

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filtered, setFiltered] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const loc = searchParams.get("location") || "";
    setQuery(q);
    setLocation(loc);
  }, [searchParams]);

  useEffect(() => {
    fetch(`${API_URL}/jobs`)
      .then((r) => r.json())
      .then((data) => {
        setJobs(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [API_URL]);

  useEffect(() => {
    let results = [...jobs];
    if (query) {
      results = results.filter(
        (j) =>
          j.title.toLowerCase().includes(query.toLowerCase()) ||
          j.company?.toLowerCase().includes(query.toLowerCase()) ||
          j.description?.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (jobType) {
      results = results.filter((j) =>
        j.title.toLowerCase().includes(jobType.toLowerCase())
      );
    }
    setFiltered(results);
  }, [query, jobType, jobs]);

  const clearFilters = () => {
    setQuery("");
    setLocation("");
    setJobType("");
  };

  const hasFilters = query || location || jobType;

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <div className="border-b border-slate-100 bg-slate-50 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <h1
            className="text-2xl font-semibold text-slate-900 mb-5"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Browse jobs
          </h1>

          {/* Search Bar */}
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm max-w-3xl">
            <div className="flex items-center gap-3 flex-1 px-4">
              <Search size={15} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Job title, skill, or company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full py-3 text-sm outline-none bg-transparent text-slate-800 placeholder-slate-400"
              />
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex items-center gap-3 px-4" style={{ minWidth: "160px" }}>
              <MapPin size={15} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Anywhere"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full py-3 text-sm outline-none bg-transparent text-slate-800 placeholder-slate-400"
              />
            </div>
            <button className="px-5 py-3 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <SlidersHorizontal size={13} className="text-slate-400" />
            {["Full-time", "Part-time", "Contract", "Remote", "Graduate"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setJobType(jobType === type ? "" : type)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    jobType === type
                      ? "border-blue-300 bg-blue-50 text-blue-600"
                      : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  {type}
                </button>
              )
            )}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs px-3 py-1.5 text-blue-600 hover:text-blue-700 flex items-center gap-1 ml-1"
              >
                <X size={11} />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-sm text-slate-500 mb-6">
          {loading ? (
            "Loading..."
          ) : (
            <>
              <span className="font-semibold text-slate-900">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "job" : "jobs"} found
              {hasFilters && (
                <span className="text-slate-400"> — filtered results</span>
              )}
            </>
          )}
        </p>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Briefcase size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium text-slate-500">No jobs found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:underline mt-3 inline-block"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
            {filtered.map((job) => (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                {/* Company Logo */}
                <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-medium text-slate-500 shrink-0">
                  {job.company?.slice(0, 2).toUpperCase() || "JB"}
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium text-slate-900"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    {job.title}
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5 font-medium">
                    {job.company || "Company"}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Briefcase size={11} />
                      Full-time
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={11} />
                      Remote
                    </span>
                  </div>
                </div>

                {/* Right side */}
                <div className="shrink-0 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/jobs/${job.id}`);
                    }}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-1"
                  >
                    Apply →
                  </button>
                  <p className="text-xs font-mono text-slate-400">
                    {timeAgo(job.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Application {
  id: number;
  job_id: number;
  user_id: number;
  resume_url: string | null;
  status: string;
  applied_at: string;
  jobs: {
    id: number;
    title: string;
    company: string;
    created_at: string;
  };
}

const timeAgo = (dateStr: string) => {
  const now = new Date();
  const diff = now.getTime() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days}d ago`;
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    pending: {
      label: "Pending",
      className: "bg-amber-50 text-amber-600 border-amber-200",
      icon: <Clock size={11} />,
    },
    reviewed: {
      label: "Reviewed",
      className: "bg-blue-50 text-blue-600 border-blue-200",
      icon: <CheckCircle size={11} />,
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-50 text-red-500 border-red-200",
      icon: <XCircle size={11} />,
    },
    accepted: {
      label: "Accepted",
      className: "bg-green-50 text-green-600 border-green-200",
      icon: <CheckCircle size={11} />,
    },
  };

  const s = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${s.className}`}>
      {s.icon}
      {s.label}
    </span>
  );
};

const Dashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!token) {
    navigate("/login");
    return;
  }
  fetch(`${API_URL}/applications`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(async (r) => {
      if (r.status === 401) {
        navigate("/login");
        return;
      }
      const data = await r.json();
      setApplications(data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, [token, API_URL, navigate]);

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    reviewed: applications.filter((a) => a.status === "reviewed").length,
    withResume: applications.filter((a) => a.resume_url).length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <div>
              <h1
                className="text-xl font-semibold text-slate-900"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Dashboard
              </h1>
              <p className="text-xs text-slate-500">Track your job applications</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/jobs")}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse jobs
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total applied", value: stats.total, icon: <Briefcase size={15} className="text-blue-600" />, bg: "bg-blue-50" },
            { label: "Pending", value: stats.pending, icon: <Clock size={15} className="text-amber-500" />, bg: "bg-amber-50" },
            { label: "Reviewed", value: stats.reviewed, icon: <CheckCircle size={15} className="text-green-600" />, bg: "bg-green-50" },
            { label: "With resume", value: stats.withResume, icon: <FileText size={15} className="text-slate-500" />, bg: "bg-slate-100" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <p
                className="text-2xl font-semibold text-slate-900"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Applications List */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2
              className="text-sm font-semibold text-slate-900"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              My applications
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {applications.length} total
            </span>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="py-20 text-center">
              <Briefcase size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No applications yet</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Start applying to jobs to track them here
              </p>
              <button
                onClick={() => navigate("/jobs")}
                className="text-sm text-blue-600 hover:underline"
              >
                Browse open roles →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  {/* Company Logo */}
                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-medium text-slate-500 shrink-0">
                    {app.jobs?.company?.slice(0, 2).toUpperCase() || "JB"}
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium text-slate-900 truncate"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {app.jobs?.title || "Unknown role"}
                    </p>
                    <p className="text-xs text-blue-600 mt-0.5">
                      {app.jobs?.company || "Unknown company"}
                    </p>
                  </div>

                  {/* Resume */}
                  <div className="shrink-0">
                    {app.resume_url ? (
                      <a
                        href={app.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        <FileText size={13} />
                        Resume
                      </a>
                    ) : (
                      <span className="text-xs text-slate-300">No resume</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="shrink-0">
                    <StatusBadge status={app.status} />
                  </div>

                  {/* Date */}
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-mono text-slate-400">
                      {timeAgo(app.applied_at)}
                    </p>
                  </div>

                  {/* View Job */}
                  <button
                    onClick={() => navigate(`/jobs/${app.job_id}`)}
                    className="shrink-0 text-slate-300 hover:text-blue-500 transition-colors"
                  >
                    <ArrowRight size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

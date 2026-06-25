import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  Upload,
  X,
  CheckCircle,
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  user_id: number;
  created_at: string;
}

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API_URL}/jobs`)
      .then((r) => r.json())
      .then((data: Job[]) => {
        const found = data.find((j) => j.id === Number(id));
        setJob(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, API_URL]);

  const handleApply = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setApplying(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("job_id", String(job?.id));
      if (resumeFile) formData.append("resume", resumeFile);

      const res = await fetch(`${API_URL}/applications`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to apply");
      }

      setApplied(true);
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="h-8 w-48 bg-slate-100 rounded-lg animate-pulse mb-6" />
        <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-slate-500 text-sm">Job not found.</p>
        <button
          onClick={() => navigate("/jobs")}
          className="text-blue-600 text-sm mt-2 hover:underline"
        >
          Back to jobs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Back */}
        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to jobs
        </button>

        <div className="grid grid-cols-3 gap-8">
          {/* Left — Job Content */}
          <div className="col-span-2">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-medium text-slate-500 shrink-0">
                {job.company?.slice(0, 2).toUpperCase() || "JB"}
              </div>
              <div>
                <h1
                  className="text-2xl font-semibold text-slate-900 leading-tight"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {job.title}
                </h1>
                <p className="text-blue-600 font-medium text-sm mt-1">
                  {job.company}
                </p>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
              <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                <Briefcase size={12} />
                Full-time
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                <MapPin size={12} />
                Remote
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                <Calendar size={12} />
                Posted {new Date(job.created_at).toLocaleDateString("en-AU")}
              </span>
            </div>

            {/* Description */}
            <div>
              <h2
                className="text-base font-semibold text-slate-900 mb-3"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                About this role
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Right — Apply Card */}
          <div className="col-span-1">
            <div className="border border-slate-200 rounded-xl p-5 sticky top-24">
              <h3
                className="text-sm font-semibold text-slate-900 mb-1"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {job.company}
              </h3>
              <p className="text-xs text-slate-500 mb-5">{job.title}</p>

              {applied ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">Applied!</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply for this role
                </button>
              )}

              {!token && (
                <p className="text-xs text-slate-400 text-center mt-3">
                  You'll need to{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-blue-600 hover:underline"
                  >
                    sign in
                  </button>{" "}
                  to apply
                </p>
              )}

              <div className="border-t border-slate-100 mt-5 pt-5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Job type</span>
                  <span className="text-slate-700 font-medium">Full-time</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Location</span>
                  <span className="text-slate-700 font-medium">Remote</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Posted</span>
                  <span className="text-slate-700 font-medium font-mono">
                    {new Date(job.created_at).toLocaleDateString("en-AU")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2
                className="text-base font-semibold text-slate-900"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Apply for {job.title}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-slate-500 mb-5">
              Applying to{" "}
              <span className="font-medium text-slate-700">{job.company}</span>
            </p>

            {/* Resume Upload */}
            <div
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                resumeFile
                  ? "border-blue-300 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
              <Upload
                size={20}
                className={`mx-auto mb-2 ${
                  resumeFile ? "text-blue-500" : "text-slate-400"
                }`}
              />
              {resumeFile ? (
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    {resumeFile.name}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeFile(null);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 mt-1"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-slate-600">Upload your resume</p>
                  <p className="text-xs text-slate-400 mt-1">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
              )}
            </div>

            {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-sm text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {applying ? "Applying..." : "Submit application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;

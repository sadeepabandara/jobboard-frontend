import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Briefcase, ChevronDown } from "lucide-react";

const PostJob = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    jobType: "Full-time",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/jobs`,
        {
          title: form.title,
          company: form.company,
          description: `[${form.jobType}]${form.location ? ` 📍 ${form.location}\n\n` : "\n\n"}${form.description}`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/jobs");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to post job");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Briefcase size={15} className="text-white" />
            </div>
            <span className="text-sm font-medium text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
              Post a job
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
            Create a new listing
          </h1>
          <p className="text-sm text-slate-500">
            Fill in the details below to post your role to TalentBoard.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Job title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                required
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Company name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                required
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all placeholder-slate-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Job type
                </label>
                <div className="relative">
                  <select
                    name="jobType"
                    value={form.jobType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all appearance-none bg-white text-slate-700"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                    <option>Graduate</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Melbourne, AU or Remote"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Job description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, requirements, and any other relevant details..."
                required
                rows={8}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all placeholder-slate-400 resize-none"
              />
              <p className="text-xs text-slate-400 mt-1.5">
                {form.description.length} characters
              </p>
            </div>

            <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {loading ? "Posting..." : "Post job →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      login(response.data.token);
      navigate("/jobs");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Invalid credentials");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] grid grid-cols-2">
      {/* Left Panel */}
      <div className="bg-slate-900 flex flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-600 opacity-10 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-500 opacity-10 pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-40 h-40 rounded-full bg-blue-400 opacity-5 pointer-events-none" />

        <div />

        <div className="relative z-10">
          <p
            className="text-3xl font-semibold text-white leading-snug mb-4"
            style={{
              fontFamily: "'Sora', sans-serif",
              letterSpacing: "-0.5px",
            }}
          >
            Your next role
            <br />
            is one click away.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-10">
            Join thousands of developers finding meaningful work through
            TalentBoard.
          </p>

          <div className="space-y-4">
            {[
              {
                title: "Apply in seconds",
                desc: "Submit your application with just a few clicks",
              },
              {
                title: "Resume management",
                desc: "Upload and manage your resume securely",
              },
              {
                title: "Track your progress",
                desc: "Stay on top of every application in one place",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-slate-300 text-sm leading-relaxed">
              "Found my first dev job through TalentBoard in under two weeks.
              The process was incredibly smooth."
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                A
              </div>
              <div>
                <p className="text-white text-xs font-medium">Alex Chen</p>
                <p className="text-slate-500 text-xs">
                  Junior Developer at Atlassian
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 relative z-10">
  © 2026 TalentBoard. All rights reserved.
</p>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center p-12 bg-white">
        <div className="w-full max-w-sm">
          <h1
            className="text-2xl font-semibold text-slate-900 mb-1"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all placeholder-slate-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

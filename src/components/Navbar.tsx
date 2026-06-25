import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Briefcase, Plus, LogOut, LayoutDashboard, Search } from "lucide-react";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-15 flex items-center justify-between py-4">

        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
          <Briefcase size={18} className="text-blue-600" />
          TalentBoard
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/jobs"
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md transition-colors ${
              isActive("/jobs")
                ? "text-blue-600 bg-blue-50"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Search size={14} />
            Browse jobs
          </Link>

          {token ? (
            <>
              <Link
                to="/post-job"
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <Plus size={14} />
                Post a job
              </Link>
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md transition-colors ${
                  isActive("/dashboard")
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm px-3 py-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors ml-1"
              >
                Register now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

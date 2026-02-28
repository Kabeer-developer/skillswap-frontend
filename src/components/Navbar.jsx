import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-violet-600 font-extrabold text-lg tracking-tight no-underline">
          <span className="w-8 h-8 rounded-lg  from-violet-600 to-blue-500 flex items-center justify-center text-white text-sm">
            ⚡
          </span>
          SkillSwap
        </Link>

        {/* Right */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/barters"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium no-underline transition-colors ${
                  isActive("/barters")
                    ? "bg-violet-50 text-violet-600"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                Barters
              </Link>

              {user.role === "Admin" && (
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold no-underline transition-colors ${
                    isActive("/admin")
                      ? "bg-amber-50 text-amber-600"
                      : "text-amber-600 hover:bg-amber-50"
                  }`}
                >
                  ⚙ Admin
                </Link>
              )}

              {/* Divider */}
              <div className="w-px h-5 bg-gray-200 mx-2" />

              {/* Credits */}
              {user.credits !== undefined && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  ⬡ {user.credits} credits
                </span>
              )}

              {/* Profile avatar pill */}
              <Link
  to="/profile"
  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 ${
    isActive("/profile")
      ? "border-violet-300 bg-violet-50"
      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
  }`}
>
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
  {getInitials(user?.name)}
</div>

<span className="text-sm font-semibold text-gray-800 tracking-tight">
  {user?.name?.split(" ")[0]}
</span>
</Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors border-none cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium no-underline transition-colors ${
                  isActive("/login")
                    ? "bg-violet-50 text-violet-600"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white  from-violet-600 to-blue-500 hover:opacity-90 transition-opacity no-underline"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
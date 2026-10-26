import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ShieldCheck,
  UserRound,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  House,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_ORIGIN } from "../../services/api";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const getPhotoUrl = (photo) => {
  if (!photo) return "";

  if (
    photo.startsWith("blob:") ||
    photo.startsWith("data:") ||
    /^https?:\/\//i.test(photo)
  ) {
    return photo;
  }

  return `${API_ORIGIN}${photo.startsWith("/") ? "" : "/"}${photo}`;
};

const Navbar = ({ transparent = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser);

  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  const isDashboardArea =
    location.pathname === "/dashboard" ||
    location.pathname.startsWith("/complaints") ||
    location.pathname.startsWith("/authorities") ||
    location.pathname === "/profile";

  const userName = user?.name || "Citizen";
  const userInitial = userName.trim().charAt(0).toUpperCase() || "C";
  const photo = getPhotoUrl(
    user?.profilePhoto || user?.avatar || user?.photoUrl || user?.profileImage,
  );

  useEffect(() => {
    setUser(getStoredUser());
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const refreshUser = () => setUser(getStoredUser());

    window.addEventListener("profileUpdated", refreshUser);
    window.addEventListener("storage", refreshUser);

    return () => {
      window.removeEventListener("profileUpdated", refreshUser);
      window.removeEventListener("storage", refreshUser);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("justLoggedIn");

    setUser(null);
    closeMenu();
    navigate("/login", { replace: true });
  };

  const linkClass = (active = false) =>
    `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
      active
        ? "bg-teal-50 text-teal-800"
        : "text-slate-700 hover:bg-teal-50 hover:text-teal-700"
    }`;

  const ProfileAvatar = ({ size = "h-8 w-8" }) => (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal-100 font-bold text-teal-700`}
    >
      {photo ? (
        <img
          src={photo}
          alt=""
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        userInitial
      )}
    </span>
  );

  return (
    <header
      className={`relative z-50 w-full border-b ${
        transparent
          ? "border-white/40 bg-white/70 backdrop-blur-xl lg:absolute lg:left-0 lg:right-0 lg:top-0 lg:bg-white/20"
          : "sticky top-0 border-slate-200/70 bg-white/95 backdrop-blur-xl"
      }`}
    >
      <div className="flex h-[68px] items-center justify-between px-4 sm:px-8 lg:px-10">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white shadow-md">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              Civic<span className="text-teal-600">RouteX</span>
            </h1>
            <p className="hidden text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:block">
              Smart Grievance Platform
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link to="/" className={linkClass(location.pathname === "/")}>
            <House size={17} />
            Home
          </Link>

          {isLoggedIn ? (
            <>
              {!isDashboardArea && (
                <Link to="/dashboard" className={linkClass()}>
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>
              )}

              {isDashboardArea && (
                <Link to="/dashboard" className={linkClass()}>
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>
              )}

              <Link
                to="/profile"
                className="ml-1 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"
              >
                <ProfileAvatar />
                <span className="max-w-28 truncate">{userName}</span>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass()}>
                <LogIn size={17} />
                Login
              </Link>

              <Link
                to="/register"
                className="ml-1 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <UserPlus size={17} />
                Get Started
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 md:hidden"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white p-4 shadow-lg md:hidden">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={closeMenu}
              className={linkClass(location.pathname === "/")}
            >
              <House size={17} />
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-teal-50 p-3">
                  <ProfileAvatar size="h-10 w-10" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {userName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user?.email || "Signed in"}
                    </p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className={linkClass(location.pathname === "/dashboard")}
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>

                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className={linkClass(location.pathname === "/profile")}
                >
                  <UserRound size={17} />
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className={linkClass()}>
                  <LogIn size={17} />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className={linkClass()}
                >
                  <UserPlus size={17} />
                  Create Account
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;

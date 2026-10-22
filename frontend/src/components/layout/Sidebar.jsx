import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  Building2,
  UserRound,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Report an Issue", path: "/complaints/create", icon: FilePlus },
  { name: "My Complaints", path: "/complaints", icon: ClipboardList },
  { name: "Authorities", path: "/authorities", icon: Building2 },
  { name: "Profile", path: "/profile", icon: UserRound },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("justLoggedIn");
    navigate("/login", { replace: true, state: null });
  };

  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-slate-200/70 bg-white/90 lg:block">
      <div className="flex min-h-[calc(100vh-4rem)] flex-col p-4">
        <div className="mb-5 rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-500 p-4 text-white shadow-lg shadow-teal-100">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <ShieldCheck size={22} />
          </div>
          <p className="text-sm font-semibold">Civic Assistance</p>
          <p className="mt-1 text-xs leading-5 text-teal-50">
            Report, track and follow public issues.
          </p>
        </div>

        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Navigation
        </p>

        <nav className="space-y-1.5">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/complaints"}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-teal-50 text-teal-800"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        isActive
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-700"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    {name}
                  </span>
                  {isActive && <ChevronRight size={16} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <div className="mb-3 h-px bg-slate-200" />
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50">
              <LogOut size={18} />
            </span>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

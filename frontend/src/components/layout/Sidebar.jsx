import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  Building2,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Report an Issue",
    path: "/complaints/create",
    icon: FilePlus,
  },
  {
    name: "My Complaints",
    path: "/complaints",
    icon: ClipboardList,
  },
  {
    name: "Authorities",
    path: "/authorities",
    icon: Building2,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];

const Sidebar = () => {
  return (
    <aside className="hidden min-h-[calc(100vh-4rem)] w-64 border-r border-slate-200/70 bg-white/75 backdrop-blur-xl lg:block">
      <div className="flex h-full flex-col p-4">
        {/* Small header */}
        <div className="mb-5 rounded-2xl bg-gradient-to-br from-teal-600 via-teal-600 to-emerald-500 p-4 text-white shadow-lg shadow-teal-100">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <ShieldIcon />
          </div>

          <p className="text-sm font-semibold">
            Civic Assistance
          </p>

          <p className="mt-1 text-xs leading-5 text-teal-50">
            Report, track and resolve public issues.
          </p>
        </div>

        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Navigation
        </p>

        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/complaints"}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                          isActive
                            ? "bg-teal-600 text-white shadow-md shadow-teal-200"
                            : "bg-slate-100 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-600"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      {link.name}
                    </div>

                    {isActive && (
                      <ChevronRight
                        size={16}
                        className="text-teal-500"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="mb-3 h-px bg-slate-200" />

          <button className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 transition group-hover:bg-rose-100">
              <LogOut size={18} />
            </div>

            Logout
          </button>

          <p className="mt-4 px-2 text-center text-[10px] text-slate-400">
            CivicRouteX v1.0
          </p>
        </div>
      </div>
    </aside>
  );
};

const ShieldIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default Sidebar;
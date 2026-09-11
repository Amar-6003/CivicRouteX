import { Bell, Menu, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ transparent = false }) => {
  return (
    <header
      className={`absolute left-0 right-0 top-0 z-50 border-b transition ${
        transparent
          ? "border-white/30 bg-white/20 backdrop-blur-md"
          : "sticky border-slate-200/70 bg-white/85 backdrop-blur-xl"
      }`}
    >
      <div className="flex h-[68px] items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white ${
              transparent
                ? "shadow-md shadow-teal-900/10"
                : "shadow-lg shadow-teal-200"
            }`}
          >
            <ShieldCheck size={21} />
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

        {/* Right side */}
        <div className="flex items-center gap-3">

          {/* Notification */}
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/60 bg-white/50 text-slate-600 backdrop-blur-sm transition hover:bg-white/80 hover:text-teal-600"
            aria-label="Notifications"
          >
            <Bell size={18} />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <div className="hidden h-7 w-px bg-slate-300/60 sm:block" />

          {/* User */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-sm font-bold text-white">
              A
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Citizen
              </p>

              <p className="text-xs text-slate-500">
                Verified Account
              </p>
            </div>
          </div>

          {/* Mobile menu */}
          <button
            className="ml-1 text-slate-600 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
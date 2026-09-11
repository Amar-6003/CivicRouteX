import {
  FileText,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import complaints from "../data/complaints";

const Dashboard = () => {
  const total = complaints.length;

  const pending = complaints.filter(
    (item) =>
      item.status?.toLowerCase() === "pending" ||
      item.status?.toLowerCase() === "in progress"
  ).length;

  const resolved = complaints.filter(
    (item) => item.status?.toLowerCase() === "resolved"
  ).length;

  return (
    <div className="page-bg min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      {/* Hero */}
      <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 p-6 text-white shadow-xl shadow-teal-200 sm:p-8">
        <div className="absolute -right-20 -top-20 h-56 w-56 animate-blob rounded-full bg-white/10 blur-2xl" />

        <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Platform is operational
            </div>

            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, Citizen 👋
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-teal-50 sm:text-base">
              Report civic issues, track your complaints and help make your
              community better.
            </p>
          </div>

          <Link
            to="/complaints/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-50"
          >
            <Plus size={18} />
            Report an Issue
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Complaints"
          value={total}
          icon={FileText}
          iconBg="bg-teal-50"
          iconColor="text-teal-600"
          trend="All submitted reports"
        />

        <StatCard
          title="Pending"
          value={pending}
          icon={Clock3}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          trend="Awaiting action"
        />

        <StatCard
          title="Resolved"
          value={resolved}
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend="Successfully closed"
        />

        <StatCard
          title="Response Rate"
          value="82%"
          icon={TrendingUp}
          iconBg="bg-cyan-50"
          iconColor="text-cyan-600"
          trend="Based on your reports"
        />
      </section>

      {/* Main content */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="dashboard-card overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h3 className="font-bold text-slate-900">
                Recent Complaints
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Latest activity on your reports
              </p>
            </div>

            <Link
              to="/complaints"
              className="flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {complaints.slice(0, 4).map((complaint) => (
              <ComplaintRow
                key={complaint.id}
                complaint={complaint}
              />
            ))}
          </div>
        </div>

        {/* Quick action */}
        <div className="dashboard-card p-6">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-100">
            <AlertCircle size={21} />
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            Have a civic issue?
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Tell us what happened. CivicRouteX can help identify the relevant
            authority and organize your complaint.
          </p>

          <Link
            to="/complaints/create"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Start a Complaint
            <ArrowRight size={17} />
          </Link>

          <div className="mt-5 rounded-xl bg-teal-50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
              <MapPin size={15} className="text-teal-600" />
              Location-aware routing
            </div>

            <p className="mt-1 text-xs leading-5 text-teal-700/70">
              Your location can help identify the appropriate authority.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
}) => {
  return (
    <div className="dashboard-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">{trend}</p>
    </div>
  );
};

const ComplaintRow = ({ complaint }) => {
  const status = complaint.status?.toLowerCase();

  const statusStyles =
    status === "resolved"
      ? "bg-emerald-50 text-emerald-700"
      : status === "rejected"
        ? "bg-rose-50 text-rose-700"
        : "bg-amber-50 text-amber-700";

  return (
    <Link
      to={`/complaints/${complaint.id}`}
      className="group flex items-center justify-between gap-4 p-5 transition hover:bg-teal-50/50"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
          <FileText size={18} />
        </div>

        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-slate-800 group-hover:text-teal-700">
            {complaint.title}
          </h4>

          <p className="mt-1 text-xs text-slate-400">
            #{complaint.id} • {complaint.category}
          </p>
        </div>
      </div>

      <span
        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${statusStyles}`}
      >
        {complaint.status}
      </span>
    </Link>
  );
};

export default Dashboard;
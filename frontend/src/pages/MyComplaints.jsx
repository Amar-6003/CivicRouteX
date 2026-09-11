import {
  Search,
  Filter,
  FileText,
  MapPin,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import complaints from "../data/complaints";

const MyComplaints = () => {
  return (
    <div className="page-bg min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">
              Complaint Center
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Complaints
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Track every issue you have reported.
            </p>
          </div>

          <Link
            to="/complaints/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-100 transition hover:-translate-y-0.5 hover:from-teal-700 hover:to-emerald-700"
          >
            <Plus size={17} />
            New Complaint
          </Link>
        </div>

        <div className="dashboard-card mb-6 p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search complaints..."
                className="input-modern pl-11"
              />
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700">
              <Filter size={17} />
              Filter
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ComplaintCard = ({ complaint }) => {
  const status = complaint.status?.toLowerCase();

  const statusStyle =
    status === "resolved"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : status === "rejected"
        ? "bg-rose-50 text-rose-700 border-rose-100"
        : "bg-amber-50 text-amber-700 border-amber-100";

  return (
    <Link
      to={`/complaints/${complaint.id}`}
      className="dashboard-card group block p-5 transition hover:border-teal-200 sm:p-6"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 text-teal-600">
            <FileText size={21} />
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="truncate font-bold text-slate-900 group-hover:text-teal-700">
                {complaint.title}
              </h3>

              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyle}`}
              >
                {complaint.status}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Complaint ID: #{complaint.id}
            </p>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
              <span>{complaint.category}</span>

              <span className="flex items-center gap-1">
                <MapPin size={13} />
                {complaint.location || "Location provided"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-teal-600">
          View Details

          <ArrowRight
            size={17}
            className="transition group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
};

export default MyComplaints;
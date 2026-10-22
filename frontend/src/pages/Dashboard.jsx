import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FilePlus2,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { apiRequest } from "../services/api";

const STATUS = {
  SUBMITTED: {
    label: "Submitted",
    style: "bg-teal-50 text-teal-700",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    style: "bg-amber-50 text-amber-700",
  },
  IN_PROGRESS: {
    label: "In Progress",
    style: "bg-cyan-50 text-cyan-700",
  },
  RESOLVED: {
    label: "Resolved",
    style: "bg-emerald-50 text-emerald-700",
  },
  REJECTED: {
    label: "Rejected",
    style: "bg-rose-50 text-rose-700",
  },
};

const getStatus = (value) =>
  STATUS[value] || {
    label: String(value || "Unknown").replaceAll("_", " "),
    style: "bg-slate-100 text-slate-600",
  };

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

function StatCard({ title, value, description, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-emerald-950">{value}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function ComplaintItem({ complaint }) {
  const status = getStatus(complaint.status);

  return (
    <Link
      to={`/complaints/${complaint.id}`}
      className="flex flex-col gap-3 rounded-xl border border-teal-100/80 p-4 transition hover:border-teal-300 hover:bg-teal-50/40 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="rounded-lg bg-teal-50 p-2 text-teal-700">
          <ClipboardList size={20} />
        </div>

        <div className="min-w-0">
          <p className="truncate font-semibold text-emerald-950">
            {complaint.title || "Untitled complaint"}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {complaint.category || "General"} ·{" "}
            {formatDate(complaint.createdAt)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Complaint ID: {complaint.id}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${status.style}`}
        >
          {status.label}
        </span>

        <ArrowRight size={17} className="shrink-0 text-teal-600" />
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const user = getStoredUser();

  const firstName =
    user?.name?.trim()?.split(/\s+/)[0] ||
    user?.fullName?.trim()?.split(/\s+/)[0] ||
    "there";

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/complaints");

      const list = Array.isArray(data) ? data : data?.complaints;

      if (!Array.isArray(list)) {
        throw new Error("Unexpected response received from the server.");
      }

      setComplaints(list);
    } catch (err) {
      setError(err.message || "Could not load complaints.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints, refreshKey]);

  const stats = useMemo(() => {
    const resolved = complaints.filter(
      (item) => item.status === "RESOLVED",
    ).length;

    const rejected = complaints.filter(
      (item) => item.status === "REJECTED",
    ).length;

    const active = complaints.filter((item) =>
      ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS"].includes(item.status),
    ).length;

    return {
      total: complaints.length,
      active,
      resolved,
      rejected,
    };
  }, [complaints]);

  const recentComplaints = useMemo(() => {
    return [...complaints]
      .sort((a, b) => {
        const first = new Date(a.updatedAt || a.createdAt || 0).getTime();

        const second = new Date(b.updatedAt || b.createdAt || 0).getTime();

        return second - first;
      })
      .slice(0, 5);
  }, [complaints]);

  return (
    <main className="min-h-screen bg-[#edf5f1] px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Welcome section */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-500 p-6 text-white shadow-lg shadow-teal-900/10 sm:p-9">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold tracking-wide text-teal-50">
                CIVICROUTEX · CITIZEN DASHBOARD
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, {firstName}!
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50 sm:text-base">
                Report civic issues, track your complaints and follow updates
                from the concerned authorities in one place.
              </p>
            </div>

            <Link
              to="/complaints/create"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-teal-700 shadow-sm transition hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-white/30"
            >
              <FilePlus2 size={19} />
              Report an Issue
            </Link>
          </div>
        </section>

        {/* Error state */}
        {error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 text-rose-600" />
              <div>
                <p className="font-semibold text-rose-800">
                  Unable to load your dashboard
                </p>
                <p className="mt-1 text-sm text-rose-700">{error}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRefreshKey((value) => value + 1)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        )}

        {/* Statistics */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-emerald-950">
                Complaint Overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your complaint statistics at a glance.
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={() => setRefreshKey((value) => value + 1)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-50 disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Complaints"
              value={loading ? "—" : stats.total}
              description="All complaints in your account"
              icon={ClipboardList}
              color="bg-teal-50 text-teal-700"
            />

            <StatCard
              title="Active Complaints"
              value={loading ? "—" : stats.active}
              description="Awaiting resolution"
              icon={Clock3}
              color="bg-amber-50 text-amber-700"
            />

            <StatCard
              title="Resolved"
              value={loading ? "—" : stats.resolved}
              description="Marked as resolved"
              icon={CheckCircle2}
              color="bg-emerald-50 text-emerald-700"
            />

            <StatCard
              title="Rejected"
              value={loading ? "—" : stats.rejected}
              description="Marked as rejected"
              icon={AlertCircle}
              color="bg-rose-50 text-rose-700"
            />
          </div>
        </section>

        {/* Main content */}
        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-emerald-950">
                  Recent Complaints
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your latest reports and their status.
                </p>
              </div>

              <Link
                to="/complaints"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-teal-700 transition hover:text-teal-900"
              >
                View all <ArrowRight size={15} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-xl bg-teal-50"
                  />
                ))}
              </div>
            ) : error ? (
              <p className="rounded-xl bg-teal-50/60 p-5 text-sm text-slate-500">
                Complaint information is temporarily unavailable.
              </p>
            ) : recentComplaints.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50/30 px-5 py-10 text-center">
                <ClipboardList size={35} className="mx-auto text-teal-600" />

                <h3 className="mt-3 font-semibold text-emerald-950">
                  No complaints yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Start by reporting a civic issue in your locality. You can
                  track its progress here.
                </p>

                <Link
                  to="/complaints/create"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100"
                >
                  <FilePlus2 size={17} />
                  Create Complaint
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentComplaints.map((complaint, index) => (
                  <ComplaintItem
                    key={complaint.id ?? complaint._id ?? index}
                    complaint={complaint}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-emerald-950">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Navigate to important sections.
              </p>

              <div className="mt-5 space-y-3">
                <Link
                  to="/complaints/create"
                  className="flex items-center gap-3 rounded-xl border border-teal-100 p-3 transition hover:border-teal-300 hover:bg-teal-50/60"
                >
                  <span className="rounded-lg bg-teal-50 p-2 text-teal-700">
                    <FilePlus2 size={19} />
                  </span>

                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-emerald-950">
                      Report an Issue
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Submit a new complaint
                    </span>
                  </span>

                  <ArrowRight size={16} className="text-teal-600" />
                </Link>

                <Link
                  to="/complaints"
                  className="flex items-center gap-3 rounded-xl border border-teal-100 p-3 transition hover:border-teal-300 hover:bg-teal-50/60"
                >
                  <span className="rounded-lg bg-cyan-50 p-2 text-cyan-700">
                    <ClipboardList size={19} />
                  </span>

                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-emerald-950">
                      My Complaints
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Track existing reports
                    </span>
                  </span>

                  <ArrowRight size={16} className="text-teal-600" />
                </Link>

                <Link
                  to="/authorities"
                  className="flex items-center gap-3 rounded-xl border border-teal-100 p-3 transition hover:border-teal-300 hover:bg-teal-50/60"
                >
                  <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                    <UserRound size={19} />
                  </span>

                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-emerald-950">
                      Authorities
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Explore public departments
                    </span>
                  </span>

                  <ArrowRight size={16} className="text-teal-600" />
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-xl border border-teal-100 p-3 transition hover:border-teal-300 hover:bg-teal-50/60"
                >
                  <span className="rounded-lg bg-teal-50 p-2 text-teal-700">
                    <UserRound size={19} />
                  </span>

                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-emerald-950">
                      My Profile
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Update personal details
                    </span>
                  </span>

                  <ArrowRight size={16} className="text-teal-600" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50 p-5">
              <h3 className="font-bold text-emerald-950">
                Better reports, better outcomes
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Describe the issue clearly, provide the correct location and
                attach relevant evidence where appropriate.
              </p>
            </div>
          </aside>
        </section>

        <p className="pb-2 text-center text-xs text-slate-400">
          Statistics are calculated from the complaints returned by the server.
        </p>
      </div>
    </main>
  );
}

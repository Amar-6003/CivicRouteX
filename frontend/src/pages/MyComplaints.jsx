import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  FileText,
  MapPin,
  ArrowRight,
  Plus,
  Copy,
} from "lucide-react";
import { Link } from "react-router-dom";

import { apiRequest } from "../services/api";
import Loader from "../components/common/Loader";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchComplaints = async () => {
      try {
        const data = await apiRequest("/complaints");
        if (active) setComplaints(data.complaints || []);
      } catch (err) {
        if (active) setError(err.message || "Unable to load complaints.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchComplaints();

    return () => {
      active = false;
    };
  }, []);

  const filteredComplaints = useMemo(() => {
    const query = search.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const matchesSearch =
        !query ||
        [
          complaint.title,
          complaint.description,
          complaint.category,
          complaint.address,
          complaint.trackingNumber,
          complaint.id,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
        );

      const matchesStatus =
        statusFilter === "ALL" || complaint.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);

  const copyReference = async (complaint) => {
    const reference = complaint.trackingNumber || `CRX-${complaint.id}`;

    try {
      await navigator.clipboard.writeText(reference);
      setCopiedId(complaint.id);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setError("Unable to copy reference. Please copy it manually.");
    }
  };

  return (
    <div className="page-bg min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">
              Complaint Center
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Complaints
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Review status, details and reference numbers for your reports.
            </p>
          </div>

          <Link
            to="/complaints/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-100"
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
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, reference, location..."
                className="input-modern pl-11"
                aria-label="Search complaints"
              />
            </div>

            <div className="relative">
              <Filter
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="input-modern min-w-[190px] appearance-none pl-11 pr-10"
                aria-label="Filter by status"
              >
                <option value="ALL">All Status</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {!loading && !error && (
            <p className="mt-3 text-xs text-slate-400">
              Showing {filteredComplaints.length} of {complaints.length}{" "}
              complaints
            </p>
          )}
        </div>

        {loading && <Loader />}

        {error && (
          <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
            {error}
          </div>
        )}

        {!loading && !error && filteredComplaints.length === 0 && (
          <div className="dashboard-card p-10 text-center">
            <FileText className="mx-auto text-slate-300" size={40} />
            <h2 className="mt-4 font-bold text-slate-800">
              {complaints.length === 0
                ? "No complaints yet"
                : "No matching complaints"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {complaints.length === 0
                ? "Your submitted complaints will appear here."
                : "Try another search term or status filter."}
            </p>
          </div>
        )}

        <div className="grid gap-4">
          {filteredComplaints.map((complaint) => (
            <article
              key={complaint.id}
              className="dashboard-card p-5 transition hover:border-teal-200 sm:p-6"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 text-teal-600">
                    <FileText size={21} />
                  </div>

                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-slate-900">
                        {complaint.title}
                      </h2>
                      <StatusBadge status={complaint.status} />
                    </div>

                    <p className="text-xs text-slate-400">
                      Complaint ID: #{complaint.id}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>{complaint.category || "Unclassified"}</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {complaint.address || "Location not provided"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="break-all rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                        Ref: {complaint.trackingNumber || `CRX-${complaint.id}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyReference(complaint)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <Copy size={13} />
                        {copiedId === complaint.id ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/complaints/${complaint.id}`}
                  className="inline-flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-teal-600 hover:text-teal-800 md:self-center"
                >
                  View Details <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const classes = {
    RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-100",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-100",
    UNDER_REVIEW: "bg-purple-50 text-purple-700 border-purple-100",
    SUBMITTED: "bg-amber-50 text-amber-700 border-amber-100",
  };

  const label = (status || "SUBMITTED").replaceAll("_", " ");

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${
        classes[status] || "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {label}
    </span>
  );
};

export default MyComplaints;

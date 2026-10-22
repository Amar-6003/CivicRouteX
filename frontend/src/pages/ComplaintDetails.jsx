import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Building2,
  ExternalLink,
  ShieldCheck,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { apiRequest, API_ORIGIN } from "../services/api";
import Loader from "../components/common/Loader";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(`/complaints/${id}`);

        setComplaint(data.complaint);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#edf5f1]">
        <Loader />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="page-bg min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/complaints"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-600"
          >
            <ArrowLeft size={17} />
            Back to My Complaints
          </Link>

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <AlertCircle
              size={48}
              className="mx-auto text-rose-500"
            />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Unable to load complaint
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error || "Complaint not found"}
            </p>

            <Link
              to="/complaints"
              className="mt-6 inline-flex rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Back to Complaints
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusLabel = complaint.status
    ?.replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const priorityLabel = complaint.priority
    ? complaint.priority.charAt(0) +
      complaint.priority.slice(1).toLowerCase()
    : "Medium";

  const statusClasses = {
    SUBMITTED:
      "bg-blue-50 text-blue-700 border-blue-100",
    UNDER_REVIEW:
      "bg-amber-50 text-amber-700 border-amber-100",
    IN_PROGRESS:
      "bg-violet-50 text-violet-700 border-violet-100",
    RESOLVED:
      "bg-emerald-50 text-emerald-700 border-emerald-100",
    REJECTED:
      "bg-rose-50 text-rose-700 border-rose-100",
  };

  const priorityClasses = {
    LOW: "bg-slate-50 text-slate-600 border-slate-200",
    MEDIUM:
      "bg-blue-50 text-blue-700 border-blue-100",
    HIGH:
      "bg-orange-50 text-orange-700 border-orange-100",
    CRITICAL:
      "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <div className="page-bg min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/complaints")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-600"
        >
          <ArrowLeft size={17} />
          Back to My Complaints
        </button>

        {/* Header */}
        <div className="mb-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">
                Complaint #{complaint.id}
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {complaint.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${
                    statusClasses[complaint.status] ||
                    "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {statusLabel}
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${
                    priorityClasses[complaint.priority] ||
                    "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {priorityLabel} Priority
                </span>

                {complaint.category && (
                  <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                    {complaint.category}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Submitted
              </p>

              <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CalendarDays
                  size={15}
                  className="text-teal-600"
                />

                {new Date(
                  complaint.createdAt
                ).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT / MAIN CONTENT */}
          <div className="space-y-6 lg:col-span-2">

            {/* Complaint Description */}
            <div className="dashboard-card p-6">
              <div className="mb-5 border-b border-slate-100 pb-5">
                <h2 className="font-bold text-slate-900">
                  Complaint Details
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Information submitted by you
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Description
                </p>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {complaint.description}
                </p>
              </div>

              {/* Location */}
              {(complaint.address ||
                complaint.city ||
                complaint.state ||
                complaint.latitude) && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                      <MapPin size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Location
                      </p>

                      {complaint.address && (
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {complaint.address}
                        </p>
                      )}

                      {(complaint.city ||
                        complaint.state) && (
                        <p className="mt-1 text-sm text-slate-500">
                          {[complaint.city, complaint.state]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}

                      {complaint.latitude &&
                        complaint.longitude && (
                          <p className="mt-2 text-xs text-slate-400">
                            Coordinates:{" "}
                            {Number(
                              complaint.latitude
                            ).toFixed(6)}
                            ,{" "}
                            {Number(
                              complaint.longitude
                            ).toFixed(6)}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Analysis */}
            <div className="dashboard-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
                    AI Analysis
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    Complaint Classification
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    AI-assisted analysis used for routing and prioritization.
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <ShieldCheck size={19} />
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Category
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-800">
                    {complaint.category ||
                      "Public Services"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Priority
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-800">
                    {priorityLabel}
                  </p>
                </div>
              </div>

              {complaint.aiSummary && (
                <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    AI Summary
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {complaint.aiSummary}
                  </p>
                </div>
              )}

              {complaint.aiSuggestion && (
                <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                    Authority Suggestion
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {complaint.aiSuggestion}
                  </p>
                </div>
              )}
            </div>

            {/* Evidence */}
            <div className="dashboard-card p-6">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Evidence
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Supporting Files
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Evidence attached to this complaint.
                </p>
              </div>

              {complaint.evidences &&
              complaint.evidences.length > 0 ? (
                <div className="space-y-3">
                  {complaint.evidences.map(
                    (evidence) => (
                      <div
                        key={evidence.id}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
                            <FileText size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-700">
                              {evidence.fileName}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {evidence.fileType ||
                                "File"}
                            </p>
                          </div>
                        </div>

                        <a
                          href={`${API_ORIGIN}${evidence.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-teal-600 shadow-sm transition hover:bg-teal-50"
                        >
                          <Download size={14} />
                          View
                        </a>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <FileText
                    size={28}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    No evidence attached.
                  </p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="dashboard-card p-6">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Complaint Timeline
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Status History
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track how your complaint progresses.
                </p>
              </div>

              <ComplaintTimeline
                timeline={complaint.timeline || []}
              />
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">

            {/* Authority */}
            <div className="dashboard-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
                    Intelligent Routing
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    Recommended Authority
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Your complaint has been classified and routed using its category and location.
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <ShieldCheck size={19} />
                </div>
              </div>

              {complaint.authority ? (
                <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50/50 p-5">

                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
                      <Building2 size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Routed To
                      </p>

                      <h3 className="mt-1 text-base font-bold leading-6 text-slate-900">
                        {complaint.authority.name}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-teal-700">
                        {complaint.authority.category}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        {complaint.authority.city
                          ? `${complaint.authority.city}, ${complaint.authority.state}`
                          : complaint.authority.state}
                      </p>
                    </div>
                  </div>

                  {complaint.authority.submissionMethod && (
                    <div className="mt-5 rounded-xl bg-white p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        How to Submit
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {complaint.authority.submissionMethod}
                      </p>
                    </div>
                  )}

                  {complaint.authority.officialContact && (
                    <div className="mt-3 rounded-xl bg-white p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Official Contact
                      </p>

                      <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                        {complaint.authority.officialContact}
                      </p>
                    </div>
                  )}

                  {complaint.authority.officialPortal && (
                    <a
                      href={
                        complaint.authority
                          .officialPortal
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                    >
                      Continue to Official Portal
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              ) : (
                <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  No verified authority information is available for this complaint.
                </div>
              )}
            </div>

            {/* Complaint Status */}
            <div className="dashboard-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Current Status
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {statusLabel}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="text-xs leading-5 text-slate-500">
                  Status updates will appear in the complaint timeline as the case progresses.
                </p>
              </div>
            </div>

            {/* Complaint ID */}
            <div className="dashboard-card p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Complaint Reference
              </p>

              <div className="mt-2 rounded-xl bg-slate-50 p-4">
                <p className="text-lg font-bold tracking-wide text-slate-900">
                  #{complaint.id}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Keep this ID for CivicRouteX tracking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8">
          <Link
            to="/complaints"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to My Complaints
          </Link>
        </div>
      </div>
    </div>
  );
};

const ComplaintTimeline = ({ timeline = [] }) => {
  return (
    <div>
      {timeline.length > 0 ? (
        <div className="space-y-0">
          {timeline.map((item, index) => {
            const isLast =
              index === timeline.length - 1;

            const status = item.status
              ?.replaceAll("_", " ")
              .toLowerCase()
              .replace(/\b\w/g, (char) =>
                char.toUpperCase()
              );

            return (
              <div
                key={item.id || index}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle2
                      size={18}
                      className="text-emerald-600"
                    />
                  </div>

                  {!isLast && (
                    <div className="my-1 h-14 w-px bg-slate-200" />
                  )}
                </div>

                <div
                  className={`min-w-0 ${
                    isLast ? "" : "pb-7"
                  }`}
                >
                  <h4 className="text-sm font-semibold text-slate-900">
                    {status}
                  </h4>

                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(
                      item.createdAt
                    ).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
          No timeline updates available yet.
        </div>
      )}
    </div>
  );
};

export default ComplaintDetails;
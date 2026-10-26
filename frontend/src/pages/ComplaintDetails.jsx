import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  ShieldCheck,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { apiRequest, API_ORIGIN } from "../services/api";
import Loader from "../components/common/Loader";
import ComplaintTimeline from "../components/complaint/ComplaintTimeline";
import ComplaintGuidance from "../components/complaint/ComplaintGuidance";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchComplaint = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(`/complaints/${id}`);

        if (active) {
          setComplaint(data.complaint);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load complaint.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchComplaint();

    return () => {
      active = false;
    };
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
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-600"
          >
            <ArrowLeft size={17} />
            Back to My Complaints
          </Link>

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <AlertCircle size={48} className="mx-auto text-rose-500" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Unable to load complaint
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {error || "Complaint not found."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const status = complaint.status || "SUBMITTED";
  const statusLabel = status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const evidenceFiles = Array.isArray(complaint.evidence)
    ? complaint.evidence
    : Array.isArray(complaint.evidences)
      ? complaint.evidences
      : [];

  const statusClasses = {
    SUBMITTED: "bg-blue-50 text-blue-700 border-blue-100",
    UNDER_REVIEW: "bg-amber-50 text-amber-700 border-amber-100",
    IN_PROGRESS: "bg-violet-50 text-violet-700 border-violet-100",
    RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-100",
  };

  const locationText = [complaint.city, complaint.district, complaint.state]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ");

  const trackingNumber = complaint.trackingNumber || `CRX-${complaint.id}`;

  return (
    <div className="page-bg min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/complaints")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-600"
        >
          <ArrowLeft size={17} />
          Back to My Complaints
        </button>

        <header className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <p className="mb-2 break-all text-xs font-bold uppercase tracking-widest text-teal-600">
              Reference: {trackingNumber}
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {complaint.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold ${
                  statusClasses[status] ||
                  "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {statusLabel}
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
              <CalendarDays size={15} className="text-teal-600" />
              {complaint.createdAt
                ? new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Date unavailable"}
            </div>
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-3">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <section className="dashboard-card p-6">
              <div className="mb-5 border-b border-slate-100 pb-5">
                <h2 className="font-bold text-slate-900">Complaint Details</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Information submitted by you
                </p>
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Description
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {complaint.description}
              </p>

              {(complaint.address ||
                locationText ||
                complaint.latitude != null) && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                      <MapPin size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Location
                      </p>
                      {complaint.address && (
                        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                          {complaint.address}
                        </p>
                      )}
                      {locationText && (
                        <p className="mt-1 text-sm text-slate-500">
                          {locationText}
                        </p>
                      )}
                      {complaint.latitude != null &&
                        complaint.longitude != null && (
                          <p className="mt-2 text-xs text-slate-400">
                            Coordinates: {Number(complaint.latitude).toFixed(6)}
                            , {Number(complaint.longitude).toFixed(6)}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="dashboard-card p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <ShieldCheck size={19} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
                    Complaint Analysis
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    Classification
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Recorded category and available analysis.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Category
                </p>
                <p className="mt-2 text-sm font-bold text-slate-800">
                  {complaint.category || "Not classified"}
                </p>
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
            </section>

            <section className="dashboard-card p-6">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Evidence
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Supporting Files
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Files attached to this complaint.
                </p>
              </div>

              {evidenceFiles.length > 0 ? (
                <div className="space-y-3">
                  {evidenceFiles.map((evidence, index) => (
                    <div
                      key={evidence.id || index}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-700">
                            {evidence.fileName || "Evidence file"}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {evidence.fileType || "File"}
                          </p>
                        </div>
                      </div>

                      {evidence.fileUrl && (
                        <a
                          href={
                            evidence.fileUrl.startsWith("http")
                              ? evidence.fileUrl
                              : `${API_ORIGIN}${evidence.fileUrl}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-teal-600 shadow-sm hover:bg-teal-50"
                        >
                          <Download size={14} />
                          View
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <FileText size={28} className="mx-auto text-slate-300" />
                  <p className="mt-2 text-sm text-slate-500">
                    No evidence attached.
                  </p>
                </div>
              )}
            </section>

            <section className="dashboard-card p-6">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Complaint Timeline
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Status History
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Recorded updates for this complaint.
                </p>
              </div>
              <ComplaintTimeline timeline={complaint.timeline || []} />
            </section>
          </div>

          <aside className="min-w-0 space-y-6">
            <div className="dashboard-card p-5 sm:p-6">
              <ComplaintGuidance complaint={complaint} />
            </div>

            <section className="dashboard-card p-6">
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
              <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
                Check the timeline for recorded status changes.
              </p>
            </section>

            <section className="dashboard-card p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Complaint Reference
              </p>
              <p className="mt-3 break-all rounded-xl bg-slate-50 p-4 text-sm font-bold tracking-wide text-slate-900">
                {trackingNumber}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Keep this reference for future enquiries about your complaint.
              </p>
            </section>
          </aside>
        </div>

        <div className="mt-8">
          <Link
            to="/complaints"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to My Complaints
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;

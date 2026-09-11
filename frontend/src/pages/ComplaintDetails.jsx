import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Building2,
  FileText,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import complaints from "../data/complaints";
import ComplaintTimeline from "../components/complaint/ComplaintTimeline";

const ComplaintDetails = () => {
  const { id } = useParams();

  const complaint = complaints.find(
    (item) => String(item.id) === String(id)
  );

  if (!complaint) {
    return (
      <div className="page-bg flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
        <div className="dashboard-card max-w-md p-8 text-center">
          <AlertCircle
            className="mx-auto text-rose-500"
            size={40}
          />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Complaint not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The complaint you're looking for doesn't exist.
          </p>

          <Link
            to="/complaints"
            className="mt-5 inline-flex rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Back to Complaints
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/complaints"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-600"
        >
          <ArrowLeft size={16} />
          Back to Complaints
        </Link>

        {/* Hero */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                  #{complaint.id}
                </span>

                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-200">
                  {complaint.status}
                </span>
              </div>

              <h2 className="max-w-3xl text-2xl font-bold tracking-tight sm:text-3xl">
                {complaint.title}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                {complaint.description}
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <FileText size={22} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="dashboard-card p-6">
              <h3 className="mb-5 font-bold text-slate-900">
                Complaint Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Info
                  icon={MapPin}
                  label="Location"
                  value={complaint.location || "Location provided"}
                />

                <Info
                  icon={Building2}
                  label="Category"
                  value={complaint.category}
                />

                <Info
                  icon={CalendarDays}
                  label="Submitted"
                  value={complaint.date || "Recently"}
                />

                <Info
                  icon={Clock3}
                  label="Current Status"
                  value={complaint.status}
                />
              </div>
            </div>

            <div className="dashboard-card p-6">
              <h3 className="mb-6 font-bold text-slate-900">
                Complaint Timeline
              </h3>

              <ComplaintTimeline
                timeline={complaint.timeline || []}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="dashboard-card p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={21} />
              </div>

              <h3 className="font-bold text-slate-900">
                Keep your reference ID
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Use your complaint ID when following up with the relevant
                authority.
              </p>

              <div className="mt-4 rounded-xl bg-teal-50 p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Reference ID
                </p>

                <p className="mt-1 text-lg font-bold text-teal-600">
                  #{complaint.id}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-teal-600 p-6 text-white shadow-lg shadow-teal-100">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-100">
                Need help?
              </p>

              <h3 className="mt-2 font-bold">
                Unsatisfied with the progress?
              </h3>

              <p className="mt-2 text-xs leading-5 text-teal-50">
                Review the available escalation options for your complaint.
              </p>

              <button className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-xs font-bold text-teal-700 hover:bg-teal-50">
                View Escalation Options
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
    <div className="flex items-center gap-3">
      <Icon size={18} className="text-teal-600" />

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default ComplaintDetails;
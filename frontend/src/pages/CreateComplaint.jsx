import {
  ArrowLeft,
  ArrowRight,
  FileText,
  MapPin,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import EvidenceUpload from "../components/complaint/EvidenceUpload";

const CreateComplaint = () => {
  return (
    <div className="page-bg min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto mb-7 max-w-5xl">
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-600"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
              <Sparkles size={14} />
              Smart Complaint Assistant
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Report a Civic Issue
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Provide the details and evidence. We’ll help structure your
              complaint and identify the appropriate authority.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="dashboard-card p-5 sm:p-7 lg:col-span-2">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <FileText size={19} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Complaint Details
              </h3>

              <p className="text-xs text-slate-400">
                Tell us about the problem
              </p>
            </div>
          </div>

          <form className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Complaint Title
              </label>

              <input
                type="text"
                placeholder="e.g. Broken street light near main road"
                className="input-modern"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <select className="input-modern">
                  <option value="">Select category</option>
                  <option>Road & Infrastructure</option>
                  <option>Garbage & Sanitation</option>
                  <option>Water Supply</option>
                  <option>Electricity</option>
                  <option>Public Safety</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Priority
                </label>

                <select className="input-modern">
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                rows="6"
                placeholder="Describe what happened, where it happened, and how it is affecting people..."
                className="input-modern resize-none"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Location
                </label>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700"
                >
                  <MapPin size={14} />
                  Use my location
                </button>
              </div>

              <input
                type="text"
                placeholder="Enter address or landmark"
                className="input-modern"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Evidence
              </label>

              <div className="rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/50 p-5">
                <EvidenceUpload />
              </div>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:-translate-y-0.5 hover:from-teal-700 hover:to-emerald-700"
            >
              <Sparkles size={18} />
              Submit Complaint
              <ArrowRight size={17} />
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
              <Sparkles size={21} />
            </div>

            <h3 className="font-bold">Smart Routing</h3>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              CivicRouteX can analyze your complaint and suggest which
              authority may be responsible.
            </p>

            <div className="mt-5 space-y-3">
              <Step number="1" text="Describe the issue" />
              <Step number="2" text="Add location & evidence" />
              <Step number="3" text="Identify authority" />
            </div>
          </div>

          <div className="dashboard-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Evidence matters
                </p>

                <p className="text-xs text-slate-400">
                  Add clear supporting material
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Photos, videos, documents and other relevant evidence can make a
              grievance easier to understand and verify.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step = ({ number, text }) => (
  <div className="flex items-center gap-3">
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/15 text-xs font-bold text-teal-300">
      {number}
    </span>

    <span className="text-xs text-slate-300">{text}</span>
  </div>
);

export default CreateComplaint;
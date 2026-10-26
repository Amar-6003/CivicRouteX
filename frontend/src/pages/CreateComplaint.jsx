import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import EvidenceUpload from "../components/complaint/EvidenceUpload";
import { apiRequest } from "../services/api";

const CreateComplaint = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "",
    district: "",
    state: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [createdComplaintId, setCreatedComplaintId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (["address", "city", "district", "state"].includes(name)) {
      setLocationDetected(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setError("");
    setLocationLoading(true);
    setLocationDetected(false);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;

        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&zoom=18&addressdetails=1`;
          const response = await fetch(url, {
            headers: { Accept: "application/json" },
          });
          if (!response.ok) throw new Error("Address lookup failed.");

          const data = await response.json();
          const address = data.address || {};

          setForm((prev) => ({
            ...prev,
            latitude: String(latitude),
            longitude: String(longitude),
            address: data.display_name || prev.address,
            city:
              address.city ||
              address.town ||
              address.village ||
              address.municipality ||
              prev.city,
            district: address.state_district || address.county || prev.district,
            state: address.state || prev.state,
          }));
          setLocationDetected(true);
        } catch {
          setForm((prev) => ({
            ...prev,
            latitude: String(latitude),
            longitude: String(longitude),
          }));
          setError(
            "Coordinates were detected, but the address could not be resolved. You can enter the address manually.",
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setLocationLoading(false);
        setError(
          err.code === 1
            ? "Location permission was denied. Allow access and try again."
            : err.code === 2
              ? "Your location could not be determined."
              : err.code === 3
                ? "Location detection timed out. Please try again."
                : "Unable to access your location.",
        );
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setCreatedComplaintId(null);

    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }

    let complaintId = null;

    try {
      setLoading(true);

      const result = await apiRequest("/complaints", {
        method: "POST",
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          latitude: form.latitude || null,
          longitude: form.longitude || null,
          city: form.city.trim() || null,
          district: form.district.trim() || null,
          state: form.state.trim() || null,
          address: form.address.trim() || null,
        }),
      });

      complaintId = result?.complaint?.id;
      if (!complaintId)
        throw new Error("The server did not return a complaint ID.");

      setCreatedComplaintId(complaintId);

      if (files.length > 0) {
        const body = new FormData();
        files.forEach((file) => body.append("files", file));

        try {
          await apiRequest(`/evidence/${complaintId}`, {
            method: "POST",
            body,
          });
        } catch (uploadError) {
          setNotice(
            `Your complaint was created (ID ${complaintId}), but the evidence upload failed: ${uploadError.message || "unknown error"}. Open the complaint details to confirm its current files before trying again.`,
          );
          return;
        }
      }

      navigate(`/complaints/${complaintId}`);
    } catch (err) {
      if (complaintId) {
        setNotice(
          `Your complaint may already have been created (ID ${complaintId}). Open its details before submitting again.`,
        );
      } else {
        setError(err.message || "Unable to submit complaint.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto mb-7 max-w-5xl">
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-600"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            <Sparkles size={14} /> Smart Complaint Assistant
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Report a Civic Issue
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Describe the problem and provide its location. Review the suggested
            filing guidance and verify any external government portal before
            submitting information there.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
        <div className="dashboard-card p-5 sm:p-7 lg:col-span-2">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <FileText size={19} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Complaint Details</h3>
              <p className="text-xs text-slate-400">
                Tell us about the problem
              </p>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-600"
            >
              {error}
            </div>
          )}
          {notice && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
            >
              <div className="flex items-start gap-2">
                <AlertCircle size={18} className="mt-1 shrink-0" />
                <p>{notice}</p>
              </div>
              {createdComplaintId && (
                <button
                  type="button"
                  onClick={() => navigate(`/complaints/${createdComplaintId}`)}
                  className="mt-3 rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800"
                >
                  Open Complaint Details
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Complaint Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={160}
                placeholder="e.g. Broken street light near main road"
                className="input-modern"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                maxLength={10000}
                placeholder="Describe what happened, where it happened, and how it affects people..."
                className="input-modern resize-y"
                required
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {form.description.length}/10000
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="text-sm font-semibold text-slate-700">
                  Location
                </label>
                <button
                  type="button"
                  onClick={useMyLocation}
                  disabled={locationLoading}
                  className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 disabled:opacity-60"
                >
                  <MapPin size={14} />{" "}
                  {locationLoading ? "Detecting..." : "Use my location"}
                </button>
              </div>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter address or landmark"
                className="input-modern"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="input-modern"
              />
              <input
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="District"
                className="input-modern"
              />
            </div>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="input-modern"
            />

            {locationDetected && (
              <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">
                ✓ Location detected and address details filled automatically.
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Evidence
              </label>
              <div className="rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/50 p-5">
                <EvidenceUpload onFilesChange={setFiles} />
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Only upload material relevant to this issue. Do not include
                sensitive personal information unless necessary.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || locationLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles size={18} />{" "}
              {loading ? "Submitting..." : "Submit Complaint"}{" "}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
              <Sparkles size={21} />
            </div>
            <h3 className="font-bold">Before you submit</h3>
            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <p>1. Describe the issue and its impact clearly.</p>
              <p>2. Provide the closest accurate location.</p>
              <p>3. Attach relevant evidence if available.</p>
              <p>
                4. Keep your tracking reference and verify external filing
                links.
              </p>
            </div>
          </div>
          <div className="dashboard-card p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-emerald-600" />
              <p className="text-sm font-bold text-slate-800">
                Official filing reminder
              </p>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Creating a record in CivicRouteX does not automatically submit it
              to a government portal. Follow the official filing process where
              required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;

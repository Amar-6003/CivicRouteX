import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  MapPin,
  Sparkles,
  ShieldCheck,
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

  const [loading, setLoading] = useState(false);

  const [locationLoading, setLocationLoading] = useState(false);

  const [locationDetected, setLocationDetected] = useState(false);

  /* =======================================================
     HANDLE INPUT
  ======================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (
      name === "address" ||
      name === "city" ||
      name === "district" ||
      name === "state"
    ) {
      setLocationDetected(false);
    }
  };

  /* =======================================================
     USE MY LOCATION
  ======================================================= */

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");

      return;
    }

    setError("");

    setLocationLoading(true);

    setLocationDetected(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        console.log("Location detected:", {
          latitude,
          longitude,
          accuracy,
        });

        /*
         * Coordinates are the authoritative location signal.
         *
         * Reverse geocoding is used only to populate
         * human-readable location fields.
         */

        try {
          const url =
            `https://nominatim.openstreetmap.org/reverse` +
            `?format=jsonv2` +
            `&lat=${encodeURIComponent(latitude)}` +
            `&lon=${encodeURIComponent(longitude)}` +
            `&zoom=18` +
            `&addressdetails=1`;

          const response = await fetch(url, {
            headers: {
              Accept: "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Unable to resolve location.");
          }

          const data = await response.json();

          const address = data.address || {};

          const city =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            "";

          const district = address.state_district || address.county || "";

          const state = address.state || "";

          const readableAddress = data.display_name || "";

          setForm((previous) => ({
            ...previous,

            latitude,

            longitude,

            address: readableAddress,

            city,

            district,

            state,
          }));

          setLocationDetected(true);
        } catch (error) {
          console.error("Reverse geocoding failed:", error);

          /*
           * Even if readable address resolution fails,
           * preserve GPS coordinates.
           */

          setForm((previous) => ({
            ...previous,

            latitude,

            longitude,
          }));

          setError(
            "Location detected, but address details could not be loaded. You can enter the location details manually.",
          );
        } finally {
          setLocationLoading(false);
        }
      },

      (error) => {
        console.error("Geolocation error:", error);

        setLocationLoading(false);

        if (error.code === 1) {
          setError(
            "Location permission was denied. Please allow location access and try again.",
          );
        } else if (error.code === 2) {
          setError("Your location could not be determined. Please try again.");
        } else if (error.code === 3) {
          setError("Location detection timed out. Please try again.");
        } else {
          setError("Unable to access your location. Please try again.");
        }
      },

      {
        enableHighAccuracy: true,

        timeout: 30000,

        maximumAge: 0,
      },
    );
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");

      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/complaints", {
        method: "POST",

        body: JSON.stringify({
          title: form.title.trim(),

          description: form.description.trim(),

          latitude: form.latitude || null,

          longitude: form.longitude || null,

          city: form.city || null,

          district: form.district || null,

          state: form.state || null,

          address: form.address || null,
        }),
      });

      const complaintId = data.complaint.id;

      /* ---------------------------------------------------
         EVIDENCE
      --------------------------------------------------- */

      if (files.length > 0) {
        const formData = new FormData();

        files.forEach((file) => {
          formData.append("files", file);
        });

        await apiRequest(`/evidence/${complaintId}`, {
          method: "POST",

          body: formData,
        });
      }

      navigate(`/complaints/${complaintId}`);
    } catch (error) {
      setError(error.message || "Unable to submit complaint.");
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
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            <Sparkles size={14} />
            Smart Complaint Assistant
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Report a Civic Issue
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Provide the details and evidence. CivicRouteX will classify the
            complaint and route it only when a responsible authority can be
            officially verified.
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
            <div className="mb-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Complaint Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
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
                rows="6"
                placeholder="Describe what happened, where it happened, and how it is affecting people..."
                className="input-modern resize-none"
                required
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Location
                </label>

                <button
                  type="button"
                  onClick={useMyLocation}
                  disabled={locationLoading}
                  className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <MapPin size={14} />

                  {locationLoading
                    ? "Detecting location..."
                    : "Use my location"}
                </button>
              </div>

              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter address or landmark"
                className="input-modern"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="input-modern"
              />

              <input
                type="text"
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="District"
                className="input-modern"
              />
            </div>

            <div>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className="input-modern"
              />
            </div>

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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:-translate-y-0.5 hover:from-teal-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles size={18} />

              {loading ? "Submitting Complaint..." : "Submit Complaint"}

              {!loading && <ArrowRight size={17} />}
            </button>
          </form>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
              <Sparkles size={21} />
            </div>

            <h3 className="font-bold">Smart Routing</h3>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              CivicRouteX classifies your complaint and assigns an authority
              only when its jurisdiction and official verification can be
              established.
            </p>

            <div className="mt-5 space-y-3">
              <Step number="1" text="Describe the issue" />

              <Step number="2" text="Add location & evidence" />

              <Step number="3" text="Verify jurisdiction" />

              <Step number="4" text="Route to verified authority" />
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

/* =========================================================
   STEP
========================================================= */

const Step = ({ number, text }) => (
  <div className="flex items-center gap-3">
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/15 text-xs font-bold text-teal-300">
      {number}
    </span>

    <span className="text-xs text-slate-300">{text}</span>
  </div>
);

export default CreateComplaint;

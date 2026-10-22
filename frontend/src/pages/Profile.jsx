import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  LoaderCircle,
  MapPin,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { apiRequest, API_ORIGIN } from "../services/api";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const readUserField = (user, ...keys) => {
  for (const key of keys) {
    if (user?.[key] != null) return user[key];
  }
  return "";
};

const getInitialForm = (user) => ({
  name: readUserField(user, "name", "fullName"),
  phone: readUserField(user, "phone", "phoneNumber"),
  address: readUserField(user, "address", "streetAddress"),
  city: readUserField(user, "city"),
  state: readUserField(user, "state"),
  pincode: readUserField(user, "pincode", "pinCode", "postalCode"),
});

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

const resolvePhotoUrl = (url) => {
  if (!url) return "";

  if (
    url.startsWith("blob:") ||
    url.startsWith("data:") ||
    /^https?:\/\//i.test(url)
  ) {
    return url;
  }

  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
};

const validateProfile = (form) => {
  const name = form.name.trim();
  const phone = form.phone.trim();
  const address = form.address.trim();
  const city = form.city.trim();
  const state = form.state.trim();
  const pincode = form.pincode.trim();

  if (name.length < 2 || name.length > 100) {
    return "Name must be between 2 and 100 characters.";
  }

  if (phone && !/^[6-9]\d{9}$/.test(phone)) {
    return "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.";
  }

  if (address.length > 300) {
    return "Address cannot exceed 300 characters.";
  }

  if (!city) {
    return "City / Town is required.";
  }

  if (city.length > 100) {
    return "City cannot exceed 100 characters.";
  }

  if (!state) {
    return "State is required.";
  }

  if (state.length > 100) {
    return "State cannot exceed 100 characters.";
  }

  if (pincode && !/^[1-9]\d{5}$/.test(pincode)) {
    return "Enter a valid 6-digit Indian PIN code.";
  }

  return "";
};

export default function Profile() {
  const [user, setUser] = useState(() => getStoredUser());
  const [form, setForm] = useState(() => getInitialForm(getStoredUser()));
  const [photoUrl, setPhotoUrl] = useState(() =>
    readUserField(
      getStoredUser(),
      "profilePhoto",
      "avatar",
      "photoUrl",
      "profileImage",
    ),
  );
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const data = await apiRequest("/auth/me");
        const freshUser = data?.user || data?.data?.user;

        if (!freshUser || cancelled) return;

        setUser(freshUser);
        setForm(getInitialForm(freshUser));
        setPhotoUrl(
          readUserField(
            freshUser,
            "profilePhoto",
            "avatar",
            "photoUrl",
            "profileImage",
          ),
        );

        localStorage.setItem("user", JSON.stringify(freshUser));
        window.dispatchEvent(new Event("profileUpdated"));
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not refresh your profile details.");
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    let cleanValue = value;

    if (name === "phone") {
      cleanValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "pincode") {
      cleanValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setForm((current) => ({
      ...current,
      [name]: cleanValue,
    }));

    setError("");
    setSuccess("");
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Choose a JPG, PNG or WEBP image.");
      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      setError("Profile photo must be 5 MB or smaller.");
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const preview = URL.createObjectURL(file);
    previewUrlRef.current = preview;

    setSelectedPhoto(file);
    setPhotoUrl(preview);
    setPhotoRemoved(false);
    setError("");
    setSuccess("");
  };

  const handleRemovePhoto = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setSelectedPhoto(null);
    setPhotoUrl("");
    setPhotoRemoved(true);
    setError("");
    setSuccess("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateProfile(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
      };

      const profileResponse = await apiRequest("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      let updatedUser = profileResponse?.user ||
        profileResponse?.data?.user || { ...user, ...payload };

      if (selectedPhoto) {
        const photoForm = new FormData();
        photoForm.append("profilePhoto", selectedPhoto);

        const photoResponse = await apiRequest("/auth/profile/photo", {
          method: "POST",
          body: photoForm,
        });

        const uploadedUser = photoResponse?.user || photoResponse?.data?.user;
        const uploadedUrl =
          photoResponse?.profilePhoto || uploadedUser?.profilePhoto;

        if (!uploadedUrl) {
          throw new Error(
            "Profile details were saved, but no photo URL was returned.",
          );
        }

        updatedUser = {
          ...updatedUser,
          ...(uploadedUser || {}),
          profilePhoto: uploadedUrl,
        };

        setPhotoUrl(uploadedUrl);
        setSelectedPhoto(null);

        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
          previewUrlRef.current = null;
        }
      }

      if (photoRemoved) {
        const removeResponse = await apiRequest("/auth/profile/photo", {
          method: "DELETE",
        });

        updatedUser = {
          ...updatedUser,
          ...(removeResponse?.user || removeResponse?.data?.user || {}),
          profilePhoto: null,
        };

        setPhotoUrl("");
      }

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("profileUpdated"));
      setPhotoRemoved(false);
      setSuccess("Your profile has been saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const displayName =
    form.name.trim() ||
    readUserField(user, "name", "fullName") ||
    "Your profile";

  const email = readUserField(user, "email");
  const photoSrc = resolvePhotoUrl(photoUrl);

  const labelClass = "block text-sm font-semibold text-emerald-950";

  const inputClass =
    "mt-2 w-full rounded-xl border border-teal-100 bg-teal-50/30 px-4 py-3 text-sm text-emerald-950 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100 disabled:bg-slate-50";

  return (
    <main className="min-h-screen bg-[#edf5f1] px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <Link
            to="/dashboard"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-teal-700"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Update your personal details and manage your profile photo.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <p className="flex-1">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="rounded p-1 hover:bg-rose-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800"
          >
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <section className="overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm">
            <div className="h-24 bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-500" />

            <div className="px-5 pb-6">
              <div className="-mt-12 flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-teal-50 text-2xl font-bold text-teal-700 shadow-md">
                  {photoSrc ? (
                    <img
                      src={photoSrc}
                      alt="Your profile"
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    getInitials(displayName)
                  )}
                </div>

                <h2 className="mt-4 break-words text-xl font-bold text-emerald-950">
                  {displayName}
                </h2>

                <p className="mt-1 break-all text-sm text-slate-500">
                  {email || "Email not available"}
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                  aria-label="Choose profile photo"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100"
                >
                  <Camera size={17} />
                  {photoSrc ? "Change Photo" : "Upload Photo"}
                </button>

                {photoSrc && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-teal-100 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <X size={16} />
                    Remove Photo
                  </button>
                )}

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  JPG, PNG or WEBP · Maximum size 5 MB
                </p>
              </div>

              <div className="mt-6 border-t border-teal-100 pt-5">
                <div className="flex items-start gap-3">
                  <span className="rounded-lg bg-teal-50 p-2 text-teal-700">
                    <ShieldCheck size={19} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-emerald-950">
                      Account Information
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your registered email is read-only. Keep your contact
                      information current.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm sm:p-7 lg:col-span-2">
            <div className="mb-6 flex items-center gap-3 border-b border-teal-100 pb-5">
              <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                <UserRound size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-emerald-950">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your details for your CivicRouteX account.
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={form.name}
                  onChange={handleFieldChange}
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  disabled
                  className={inputClass}
                />
                <p className="mt-2 text-xs text-slate-400">
                  Your registered email cannot be edited here.
                </p>
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  value={form.phone}
                  onChange={handleFieldChange}
                  placeholder="10-digit Indian mobile number"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Optional. If provided, enter 10 digits starting with 6, 7, 8
                  or 9.
                </p>
              </div>

              <div>
                <label htmlFor="address" className={labelClass}>
                  Street Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  rows={3}
                  maxLength={300}
                  value={form.address}
                  onChange={handleFieldChange}
                  placeholder="House number, street and locality"
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className={labelClass}>
                    City / Town <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    required
                    maxLength={100}
                    value={form.city}
                    onChange={handleFieldChange}
                    placeholder="Enter city or town"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="state" className={labelClass}>
                    State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    autoComplete="address-level1"
                    required
                    maxLength={100}
                    value={form.state}
                    onChange={handleFieldChange}
                    placeholder="Enter state"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pincode" className={labelClass}>
                  PIN Code
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="pointer-events-none absolute left-4 top-[58%] -translate-y-1/2 text-teal-600"
                  />

                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={6}
                    value={form.pincode}
                    onChange={handleFieldChange}
                    placeholder="6-digit PIN code"
                    className={`${inputClass} pl-11 leading-5`}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Optional. If provided, enter a 6-digit PIN code starting with
                  1–9.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-teal-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-400">
                  Changes are submitted to the server when you save.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

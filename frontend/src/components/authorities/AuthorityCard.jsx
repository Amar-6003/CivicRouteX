
import {
  MapPin,
  Landmark,
  BadgeCheck,
  ExternalLink,
  Globe,
  Building2,
  Phone,
  ShieldCheck,
} from "lucide-react";

const isValidHttpUrl = (value) => {
  if (!value) return false;

  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
};

export default function AuthorityCard({ authority }) {
  const isLgdRecord =
    authority?.lgdCode !== undefined &&
    authority?.lgdCode !== null;

  const name = authority?.name || "Unnamed government body";

  const type = isLgdRecord
    ? authority?.typeName ||
      authority?.type ||
      authority?.entityType ||
      "Local government body"
    : authority?.category || "Government authority";

  const level = authority?.level || "";

  const state =
    authority?.stateName || authority?.state || "";

  const district =
    authority?.districtName || authority?.district || "";

  const city = authority?.city || "";

  const location = [city, district, state]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ");

  const source = isLgdRecord
    ? authority?.source || "Local Government Directory (LGD)"
    : authority?.source || "Authority directory";

  const portal = authority?.officialPortal || authority?.website || null;

  // An LGD record verifies directory data, not portal ownership.
  const verified = isLgdRecord
    ? false
    : authority?.verified === true;

  const showPortal = verified && isValidHttpUrl(portal);

  const contact =
    !isLgdRecord && typeof authority?.officialContact === "string"
      ? authority.officialContact.trim()
      : "";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-md">
      <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-teal-700">
            {isLgdRecord ? (
              <Building2 size={21} />
            ) : (
              <Landmark size={21} />
            )}
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
              verified
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {verified ? (
              <BadgeCheck size={12} />
            ) : (
              <Landmark size={12} />
            )}
            {verified
              ? "Verified authority"
              : isLgdRecord
                ? "LGD record"
                : "Unverified authority"}
          </span>
        </div>

        <h3 className="mt-4 break-words text-base font-bold leading-6 text-slate-800">
          {name}
        </h3>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          {type}
        </p>

        {level && (
          <p className="mt-2 text-xs font-medium text-teal-700">
            Government level: {level}
          </p>
        )}

        {location && (
          <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-600">
            <MapPin
              size={15}
              className="mt-0.5 shrink-0 text-teal-600"
            />
            <span>{location}</span>
          </div>
        )}

        {authority?.lgdCode != null && (
          <p className="mt-2 text-xs text-slate-400">
            LGD Code: {authority.lgdCode}
          </p>
        )}

        {contact && (
          <div className="mt-3 flex items-start gap-2 break-words text-xs leading-5 text-slate-600">
            <Phone
              size={14}
              className="mt-0.5 shrink-0 text-teal-600"
            />
            <span>{contact}</span>
          </div>
        )}

        <div className="mt-auto pt-5">
          <div className="mb-3 flex items-start gap-2 border-t border-slate-100 pt-3 text-[11px] leading-5 text-slate-500">
            {verified ? (
              <ShieldCheck
                size={14}
                className="mt-0.5 shrink-0 text-emerald-600"
              />
            ) : (
              <Landmark
                size={14}
                className="mt-0.5 shrink-0 text-slate-400"
              />
            )}
            <span className="break-words">Source: {source}</span>
          </div>

          {showPortal ? (
            <a
              href={portal}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-3 py-3 text-xs font-semibold text-white transition hover:bg-teal-700"
            >
              <Globe size={15} />
              Official Website
              <ExternalLink size={13} />
            </a>
          ) : (
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-3 text-center text-xs leading-5 text-amber-800">
              Official complaint portal not verified
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

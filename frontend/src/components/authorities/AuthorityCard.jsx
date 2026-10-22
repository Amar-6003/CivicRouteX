
import {
  Building2,
  MapPin,
  ExternalLink,
  Phone,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

const getSafeWebsite = (value) => {
  if (!value || typeof value !== "string") return null;

  try {
    const url = new URL(value);

    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.href;
    }
  } catch {
    return null;
  }

  return null;
};

const AuthorityCard = ({ authority }) => {
  const name = authority.name || "Unnamed authority";

  const category =
    authority.category ||
    authority.department ||
    "Government authority";

  const level =
    authority.level ||
    authority.jurisdictionType ||
    null;

  const location = [
    authority.city,
    authority.district,
    authority.state,
    authority.country && authority.country !== "India"
      ? authority.country
      : null,
  ]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ");

  const contact =
    authority.officialContact ||
    authority.phone ||
    null;

  const website = getSafeWebsite(
    authority.officialPortal || authority.website
  );

  return (
    <article className="dashboard-card overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600" />

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
            <Building2 size={22} />
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              authority.verified === true
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {authority.verified === true ? (
              <ShieldCheck size={13} />
            ) : (
              <ShieldAlert size={13} />
            )}
            {authority.verified === true
              ? "Marked verified"
              : "Unverified"}
          </span>
        </div>

        <h2 className="mt-4 break-words font-bold leading-6 text-slate-900">
          {name}
        </h2>

        <p className="mt-2 text-sm leading-5 text-slate-500">
          {category}
        </p>

        {level && (
          <span className="mt-3 inline-block rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            {level}
          </span>
        )}

        <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
          {location && (
            <div className="flex items-start gap-3 text-xs leading-5 text-slate-500">
              <MapPin
                size={15}
                className="mt-0.5 shrink-0 text-teal-600"
              />
              <span>{location}</span>
            </div>
          )}

          {contact && (
            <div className="flex items-start gap-3 text-xs leading-5 text-slate-500">
              <Phone
                size={15}
                className="mt-0.5 shrink-0 text-teal-600"
              />
              <span className="break-words">{contact}</span>
            </div>
          )}

          {authority.submissionMethod && (
            <p className="text-xs leading-5 text-slate-500">
              <strong className="text-slate-700">
                Submission channel:
              </strong>{" "}
              {authority.submissionMethod}
            </p>
          )}

          {authority.source && (
            <p className="break-words text-xs leading-5 text-slate-400">
              Source: {authority.source}
            </p>
          )}
        </div>

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-teal-700"
          >
            Official Website
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    </article>
  );
};

export default AuthorityCard;

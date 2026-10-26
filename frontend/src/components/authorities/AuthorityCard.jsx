import {
  MapPin,
  Landmark,
  BadgeCheck,
  ExternalLink,
  Globe,
} from "lucide-react";

const isValidHttpUrl = (value) => {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

export default function AuthorityCard({ authority }) {
  const name = authority?.name || "Unnamed local body";

  const type =
    authority?.typeName || authority?.type || "Local government body";

  const state = authority?.stateName || authority?.state || "";

  const district = authority?.districtName || authority?.district || "";

  const source = authority?.source || "Local Government Directory (LGD)";

  const portal = authority?.officialPortal || authority?.website || null;

  const verified = authority?.verified === true;

  const showPortal = verified && isValidHttpUrl(portal);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-md">
      <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-teal-700">
            <Landmark size={19} />
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
              verified
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {verified && <BadgeCheck size={12} />}
            {verified ? "Verified" : "Directory record"}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-5 text-slate-800">
          {name}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">{type}</p>

        {(state || district) && (
          <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-600">
            <MapPin size={14} className="mt-0.5 shrink-0 text-teal-600" />

            <span>
              {[district, state]
                .filter(Boolean)
                .filter(
                  (value, index, values) => values.indexOf(value) === index,
                )
                .join(", ")}
            </span>
          </div>
        )}

        {authority?.lgdCode && (
          <p className="mt-2 text-[11px] text-slate-400">
            LGD Code: {authority.lgdCode}
          </p>
        )}

        <div className="mt-auto pt-4">
          <div className="mb-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
            <BadgeCheck size={13} className="shrink-0 text-teal-600" />

            <span className="line-clamp-2">Source: {source}</span>
          </div>

          {showPortal ? (
            <a
              href={portal}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-teal-700"
            >
              <Globe size={14} />
              Official Website
              <ExternalLink size={13} />
            </a>
          ) : (
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-center text-[11px] leading-4 text-amber-800">
              Official complaint portal not verified
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

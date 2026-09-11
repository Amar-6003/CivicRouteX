import {
  Building2,
  MapPin,
  ExternalLink,
  Mail,
} from "lucide-react";

const AuthorityCard = ({ authority }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-xl bg-teal-50 p-3">
          <Building2
            size={22}
            className="text-teal-600"
          />
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">
            {authority.name}
          </h3>

          <p className="text-sm text-slate-500">
            {authority.department}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex gap-2">
          <MapPin
            size={17}
            className="shrink-0 text-teal-600"
          />

          <span>{authority.location}</span>
        </div>

        <div className="flex gap-2">
          <Mail
            size={17}
            className="shrink-0 text-teal-600"
          />

          <span>{authority.email}</span>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <a
          href={authority.website}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Official Website
          <ExternalLink size={15} />
        </a>
      </div>
    </div>
  );
};

export default AuthorityCard;
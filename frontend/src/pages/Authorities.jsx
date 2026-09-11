import {
  Search,
  Building2,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import authorities from "../data/authorities";

const Authorities = () => {
  return (
    <div className="page-bg min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">
            Authority Directory
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Government Authorities
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Explore relevant departments and authorities responsible for
            resolving civic issues.
          </p>
        </div>

        <div className="dashboard-card mb-7 p-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search authorities or departments..."
              className="input-modern pl-11"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {authorities.map((authority) => (
            <AuthorityCard
              key={authority.id || authority.name}
              authority={authority}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const AuthorityCard = ({ authority }) => {
  return (
    <div className="dashboard-card group overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600" />

      <div className="p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
            <Building2 size={22} />
          </div>

          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
            VERIFIED
          </span>
        </div>

        <h3 className="font-bold text-slate-900">
          {authority.name}
        </h3>

        <p className="mt-2 text-sm leading-5 text-slate-500">
          {authority.department || authority.description}
        </p>

        <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
          {authority.location && (
            <div className="flex items-start gap-3 text-xs text-slate-500">
              <MapPin
                size={15}
                className="mt-0.5 shrink-0 text-teal-600"
              />
              {authority.location}
            </div>
          )}

          {authority.phone && (
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <Phone
                size={15}
                className="shrink-0 text-teal-600"
              />
              {authority.phone}
            </div>
          )}

          {authority.email && (
            <div className="flex items-center gap-3 break-all text-xs text-slate-500">
              <Mail
                size={15}
                className="shrink-0 text-teal-600"
              />
              {authority.email}
            </div>
          )}
        </div>

        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 transition group-hover:bg-teal-50 group-hover:text-teal-700">
          View Authority
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default Authorities;
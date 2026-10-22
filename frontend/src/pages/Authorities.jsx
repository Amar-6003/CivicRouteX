import { useEffect, useMemo, useState } from "react";
import { Search, Building2, ShieldCheck, RefreshCw } from "lucide-react";

import { apiRequest } from "../services/api";
import Loader from "../components/common/Loader";
import AuthorityCard from "../components/authorities/AuthorityCard";

const PAGE_SIZE = 50;

const Authorities = () => {
  const [authorities, setAuthorities] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAuthorities = async () => {
    setLoading(true);
    setError("");

    try {
      const allAuthorities = [];
      let page = 1;
      let totalPages = 1;

      do {
        const response = await apiRequest(
          `/authorities?page=${page}&limit=${PAGE_SIZE}`,
        );

        const list = Array.isArray(response) ? response : response?.authorities;

        if (!Array.isArray(list)) {
          throw new Error("The server returned an invalid authority list.");
        }

        allAuthorities.push(...list);

        totalPages = Math.max(1, Number(response?.pagination?.totalPages) || 1);

        page += 1;
      } while (page <= totalPages);

      setAuthorities(allAuthorities);
    } catch (err) {
      setError(err.message || "Unable to load authorities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthorities();
  }, []);

  const filteredAuthorities = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return authorities;

    return authorities.filter((authority) =>
      [
        authority.name,
        authority.category,
        authority.department,
        authority.level,
        authority.jurisdictionType,
        authority.city,
        authority.district,
        authority.state,
        authority.country,
        authority.source,
        authority.submissionMethod,
        authority.officialContact,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [authorities, search]);

  const verifiedCount = authorities.filter(
    (authority) => authority.verified === true,
  ).length;

  return (
    <div className="page-bg min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">
            Authority Directory
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Government Authorities
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Find available government departments and authorities relevant to
            civic issues across different jurisdictions.
          </p>
        </header>

        <section className="dashboard-card mb-6 p-4 sm:p-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search authority, category, city or state..."
              className="input-modern pl-11"
              aria-label="Search authorities"
            />
          </div>

          {!loading && !error && (
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span>
                Showing{" "}
                <strong className="text-slate-800">
                  {filteredAuthorities.length}
                </strong>{" "}
                of {authorities.length} available records
              </span>

              <span>
                <ShieldCheck
                  size={14}
                  className="mr-1 inline text-emerald-600"
                />
                {verifiedCount} marked verified
              </span>
            </div>
          )}
        </section>

        <div className="mb-6 rounded-xl border border-teal-100 bg-teal-50/70 p-4 text-sm leading-6 text-slate-600">
          <strong className="text-slate-800">Directory coverage:</strong> This
          directory displays records currently available in CivicRouteX. It is
          not yet a complete directory of every government authority across
          India. A verified marker reflects the stored record and does not
          guarantee that an authority has received your complaint.
        </div>

        {loading && <Loader />}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700"
          >
            <p className="font-semibold">
              Unable to load the Authority Directory
            </p>

            <p className="mt-1">{error}</p>

            <button
              type="button"
              onClick={fetchAuthorities}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 font-semibold hover:bg-rose-100"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredAuthorities.length === 0 && (
          <div className="dashboard-card p-10 text-center">
            <Building2 size={40} className="mx-auto text-slate-300" />

            <h2 className="mt-4 font-bold text-slate-800">
              {authorities.length
                ? "No matching authorities"
                : "No authority records available"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {authorities.length
                ? "Try another authority name, category, city or state."
                : "No records are available in the directory right now."}
            </p>
          </div>
        )}

        {!loading && !error && filteredAuthorities.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredAuthorities.map((authority, index) => (
              <AuthorityCard
                key={authority.id ?? authority.name ?? index}
                authority={authority}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Authorities;

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Landmark,
  AlertCircle,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import AuthorityCard from "../components/authorities/AuthorityCard";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const PAGE_SIZE = 12;

const getValidPage = (value) => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

export default function Authorities() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = getValidPage(searchParams.get("page"));
  const urlSearch = searchParams.get("search") || "";
  const urlState = searchParams.get("state") || "";

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [stateInput, setStateInput] = useState(urlState);

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchInput(urlSearch);
    setStateInput(urlState);
  }, [urlSearch, urlState]);

  const loadAuthorities = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        if (urlSearch.trim()) {
          params.set("search", urlSearch.trim());
        }

        if (urlState.trim()) {
          params.set("state", urlState.trim());
        }

        const response = await fetch(
          `${API_BASE}/lgd/local-bodies?${params.toString()}`,
          { signal },
        );

        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(
            result.message || "Could not load the authority directory.",
          );
        }

        const localBodies = result.localBodies ?? result.data ?? [];

        setData(Array.isArray(localBodies) ? localBodies : []);

        const receivedPagination = result.pagination ?? {};
        const totalPages = Math.max(
          1,
          Number(receivedPagination.totalPages) || 1,
        );

        // Keep the URL and displayed page within the valid range.
        if (page > totalPages) {
          setSearchParams(
            (previous) => {
              const next = new URLSearchParams(previous);
              next.set("page", String(totalPages));
              return next;
            },
            { replace: true },
          );
          return;
        }

        setPagination({
          page: Number(receivedPagination.page) || page,
          limit: Number(receivedPagination.limit) || PAGE_SIZE,
          total: Number(receivedPagination.total) || 0,
          totalPages,
        });
      } catch (err) {
        if (err.name === "AbortError") return;

        setData([]);
        setError(
          err.message || "Something went wrong while loading authorities.",
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [page, urlSearch, urlState, setSearchParams],
  );

  useEffect(() => {
    const controller = new AbortController();

    loadAuthorities(controller.signal);

    return () => controller.abort();
  }, [loadAuthorities]);

  const updateUrl = (nextPage, nextSearch, nextState) => {
    const params = new URLSearchParams();

    params.set("page", String(nextPage));

    if (nextSearch.trim()) {
      params.set("search", nextSearch.trim());
    }

    if (nextState.trim()) {
      params.set("state", nextState.trim());
    }

    setSearchParams(params);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateUrl(1, searchInput, stateInput);
  };

  const handlePageChange = (nextPage) => {
    const safePage = Math.min(Math.max(1, nextPage), pagination.totalPages);

    if (safePage === page) return;

    updateUrl(safePage, urlSearch, urlState);
  };

  const handleRefresh = () => {
    const controller = new AbortController();
    loadAuthorities(controller.signal);
  };

  const startItem = pagination.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;

  const endItem = Math.min(page * PAGE_SIZE, pagination.total);

  return (
    <div className="min-h-screen bg-emerald-50/40 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                <Landmark size={27} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                  Government Authorities
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Search local government bodies by name or state. Check
                  available authority information before submitting a complaint.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </header>

        <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]"
          >
            <label className="relative block">
              <span className="sr-only">Search authority</span>
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search local body by name..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label>
              <span className="sr-only">Filter by state</span>
              <input
                type="text"
                value={stateInput}
                onChange={(event) => setStateInput(event.target.value)}
                placeholder="Filter by state..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <Search size={17} />
              Search
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-600">
              {loading
                ? "Loading authorities..."
                : `${pagination.total.toLocaleString()} local bodies found`}
            </p>

            {(urlSearch || urlState) && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setStateInput("");
                  updateUrl(1, "", "");
                }}
                className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Unable to load authorities</p>
              <p className="mt-1">{error}</p>
              <button
                type="button"
                onClick={handleRefresh}
                className="mt-3 font-semibold underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-emerald-100 bg-white p-5"
              >
                <div className="h-5 w-2/3 rounded bg-slate-200" />
                <div className="mt-4 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-3 h-4 w-3/4 rounded bg-slate-100" />
                <div className="mt-6 h-10 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : !error && data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {data.map((authority, index) => (
                <AuthorityCard
                  key={
                    authority.id ??
                    authority.localBodyCode ??
                    authority.lgdCode ??
                    `${authority.name ?? "authority"}-${index}`
                  }
                  authority={authority}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {startItem}-{endItem}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800">
                  {pagination.total.toLocaleString()}
                </span>
              </p>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                  Page {page} of {pagination.totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= pagination.totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        ) : (
          !error && (
            <div className="rounded-2xl border border-dashed border-emerald-200 bg-white px-5 py-14 text-center">
              <Landmark size={38} className="mx-auto text-emerald-300" />
              <h2 className="mt-4 text-lg font-semibold text-slate-800">
                No local bodies found
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try another authority name or state, or clear your filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setStateInput("");
                  updateUrl(1, "", "");
                }}
                className="mt-5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Clear filters
              </button>
            </div>
          )
        )}

        <p className="px-1 text-xs leading-5 text-slate-500">
          This directory lists local bodies. An official complaint portal or
          contact link should only be treated as verified when supported by a
          reliable official source.
        </p>
      </div>
    </div>
  );
}

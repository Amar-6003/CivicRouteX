import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ExternalLink,
  LoaderCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { apiRequest } from "../../services/api";

const cacheKey = (id) => `crx-guidance-${id}`;

const readCache = (id) => {
  try {
    const saved = localStorage.getItem(cacheKey(id));
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const ComplaintGuidance = ({ complaint }) => {
  const complaintId = complaint?.id;

  const [guidance, setGuidance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setGuidance(complaintId ? readCache(complaintId) : null);
    setError("");
  }, [complaintId]);

  const findGuidance = async () => {
    if (!complaintId || loading) return;

    const cached = readCache(complaintId);

    if (cached) {
      setGuidance(cached);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiRequest(`/complaints/${complaintId}/guidance`);

      if (!response?.guidance) {
        throw new Error("No guidance was returned for this complaint.");
      }

      setGuidance(response.guidance);

      try {
        localStorage.setItem(
          cacheKey(complaintId),
          JSON.stringify(response.guidance),
        );
      } catch {
        // Keep guidance available in the current component state.
      }
    } catch (err) {
      setError(err.message || "Unable to retrieve filing guidance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <ShieldCheck size={20} />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Official Filing Guidance
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Find where to file
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review available filing information and sources relevant to your
            complaint.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold text-slate-500">YOUR COMPLAINT</p>
        <p className="mt-1 text-sm font-semibold text-slate-800">
          {complaint?.title || "Civic complaint"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {[
            complaint?.category,
            complaint?.city,
            complaint?.district,
            complaint?.state,
          ]
            .filter(Boolean)
            .join(" · ") || "Location not available"}
        </p>
      </div>

      <button
        type="button"
        onClick={findGuidance}
        disabled={loading || !complaintId}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <LoaderCircle size={17} className="animate-spin" />
            Loading guidance...
          </>
        ) : (
          <>
            <Search size={17} />
            {guidance ? "Guidance Saved" : "Find Portal & Filing Steps"}
          </>
        )}
      </button>

      {guidance && (
        <p className="mt-2 text-xs text-emerald-700">
          Previously retrieved guidance is saved on this device.
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
        >
          {error}
        </div>
      )}

      {guidance && (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-bold text-slate-900">
              Recommended next step
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {guidance.summary || "Review the available sources below."}
            </p>

            {guidance.authorityName && (
              <p className="mt-3 text-sm text-slate-700">
                <span className="font-semibold">Possible authority: </span>
                {guidance.authorityName}
              </p>
            )}
          </div>

          {guidance.complaintPortalUrl &&
            /^https:\/\//i.test(guidance.complaintPortalUrl) && (
              <a
                href={guidance.complaintPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800 hover:bg-teal-100"
              >
                {guidance.complaintPortalLabel || "Open Complaint Portal"}
                <ExternalLink size={15} />
              </a>
            )}

          {Array.isArray(guidance.steps) && guidance.steps.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900">How to file</h3>
              <ol className="mt-3 space-y-3">
                {guidance.steps.map((step, index) => (
                  <li
                    key={`${index}-${step}`}
                    className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {Array.isArray(guidance.sources) && guidance.sources.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Reference sources
              </h3>
              <div className="mt-3 space-y-3">
                {guidance.sources.map((source, index) => (
                  <div
                    key={`${source.url || "source"}-${index}`}
                    className="rounded-xl border border-slate-200 p-3"
                  >
                    {source.url && /^https:\/\//i.test(source.url) ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start justify-between gap-2 text-sm font-semibold text-slate-800 hover:text-teal-700"
                      >
                        {source.title || "Open source"}
                        <ExternalLink size={14} className="mt-1 shrink-0" />
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-slate-800">
                        {source.title || "Reference source"}
                      </p>
                    )}

                    {source.snippet && (
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {source.snippet}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <AlertTriangle
              size={16}
              className="mt-0.5 shrink-0 text-amber-700"
            />
            <p className="text-xs leading-5 text-amber-900">
              {guidance.caution ||
                "Verify the destination and responsible authority before sharing personal information."}{" "}
              CivicRouteX does not submit your complaint to the government.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ComplaintGuidance;

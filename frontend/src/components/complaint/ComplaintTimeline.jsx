import { CheckCircle2, Circle } from "lucide-react";

const formatStatus = (status = "Update") =>
  status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const ComplaintTimeline = ({ timeline = [] }) => {
  const entries = [...timeline].sort(
    (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
  );

  if (!entries.length) {
    return (
      <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
        No timeline updates are available yet. Updates will appear here when
        they are recorded.
      </div>
    );
  }

  return (
    <ol className="space-y-0">
      {entries.map((item, index) => {
        const isLast = index === entries.length - 1;
        const isResolved = item.status === "RESOLVED";

        return (
          <li key={item.id || `${item.status}-${index}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              {isResolved ? (
                <CheckCircle2 size={22} className="shrink-0 text-emerald-600" />
              ) : (
                <Circle size={22} className="shrink-0 text-teal-600" />
              )}

              {!isLast && (
                <div className="my-1 min-h-10 w-px flex-1 bg-slate-200" />
              )}
            </div>

            <div className={isLast ? "pb-1" : "pb-7"}>
              <h4 className="text-sm font-semibold text-slate-900">
                {formatStatus(item.status)}
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString("en-IN")
                  : "Date unavailable"}
              </p>

              {item.message && (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {item.message}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default ComplaintTimeline;

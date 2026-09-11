import { CheckCircle2, Circle } from "lucide-react";

const ComplaintTimeline = ({ timeline = [] }) => {
  return (
    <div className="space-y-0">
      {timeline.map((item, index) => {
        const isLast = index === timeline.length - 1;

        return (
          <div
            key={item.id || index}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              {item.completed ? (
                <CheckCircle2
                  size={22}
                  className="shrink-0 text-emerald-600"
                />
              ) : (
                <Circle
                  size={22}
                  className="shrink-0 text-slate-300"
                />
              )}

              {!isLast && (
                <div className="my-1 h-12 w-px bg-slate-200" />
              )}
            </div>

            <div className="pb-8">
              <h4
                className={`text-sm font-semibold ${
                  item.completed
                    ? "text-slate-900"
                    : "text-slate-400"
                }`}
              >
                {item.title}
              </h4>

              {item.date && (
                <p className="mt-1 text-xs text-slate-500">
                  {item.date}
                </p>
              )}

              {item.description && (
                <p className="mt-1 text-sm text-slate-500">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {timeline.length === 0 && (
        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          No timeline updates available yet.
        </div>
      )}
    </div>
  );
};

export default ComplaintTimeline;
import {
  MapPin,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const ComplaintCard = ({ complaint }) => {
  const statusStyles = {
    Pending: "bg-amber-50 text-amber-700",
    "In Progress": "bg-blue-50 text-blue-700",
    Resolved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-rose-50 text-rose-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">
            #{complaint.id}
          </p>

          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {complaint.title}
          </h3>
        </div>

        <span
          className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
            statusStyles[complaint.status] ||
            "bg-slate-100 text-slate-600"
          }`}
        >
          {complaint.status}
        </span>
      </div>

      <p className="mb-4 line-clamp-2 text-sm text-slate-600">
        {complaint.description}
      </p>

      <div className="mb-4 space-y-2 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          {complaint.location}
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          {complaint.date}
        </div>
      </div>

      <Link
        to={`/complaints/${complaint.id}`}
        className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700"
      >
        View complaint
        <ArrowRight size={16} />
      </Link>
    </div>
  );
};

export default ComplaintCard;
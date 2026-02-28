const statusConfig = {
  Pending:   "bg-amber-50 text-amber-600",
  Accepted:  "bg-blue-50 text-blue-600",
  Completed: "bg-emerald-50 text-emerald-600",
  Rejected:  "bg-red-50 text-red-600",
};

export default function MatchCard({ match }) {
  const statusStyle = statusConfig[match.status] ?? "bg-gray-100 text-gray-500";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-200">

      {/* Skills exchange row */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-800 truncate">
          {match.offeredSkill?.title ?? "—"}
        </span>
        <span className="text-gray-300 font-bold ">↔</span>
        <span className="text-sm font-semibold text-gray-800 truncate">
          {match.neededSkill?.title ?? "—"}
        </span>
      </div>

      {/* Status badge */}
      <div className="mt-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle}`}>
          {match.status}
        </span>
      </div>

    </div>
  );
}
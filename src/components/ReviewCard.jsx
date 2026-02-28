const palette = [
  ["text-violet-600", "bg-violet-50"],
  ["text-blue-600",   "bg-blue-50"],
  ["text-emerald-600","bg-emerald-50"],
  ["text-amber-600",  "bg-amber-50"],
  ["text-rose-600",   "bg-rose-50"],
  ["text-cyan-600",   "bg-cyan-50"],
];

export function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export function getAvatarColors(name = "") {
  return palette[(name?.charCodeAt(0) ?? 0) % palette.length];
}

export function formatDate(str) {
  if (!str) return "";
  return new Date(str).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export function Stars({ rating, size = "text-sm" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`${size} ${n <= rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
      ))}
    </div>
  );
}

export default function ReviewCard({ review }) {
  const name = review.reviewerId?.name ?? "Anonymous";
  const [text, bg] = getAvatarColors(name);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${bg} ${text}`}>
            {getInitials(name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-none">{name}</p>
            <p className="text-xs text-gray-400 mt-1">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <Stars rating={review.rating} />
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500 leading-relaxed">
          "{review.comment}"
        </p>
      )}
    </div>
  );
}
export const categoryConfig = {
  Technology:   { color: "bg-blue-50 text-blue-600",       icon: "💻" },
  Design:       { color: "bg-pink-50 text-pink-600",       icon: "🎨" },
  Music:        { color: "bg-purple-50 text-purple-600",   icon: "🎵" },
  Language:     { color: "bg-green-50 text-green-600",     icon: "🌐" },
  Business:     { color: "bg-amber-50 text-amber-600",     icon: "💼" },
  Fitness:      { color: "bg-orange-50 text-orange-600",   icon: "🏋️" },
  Cooking:      { color: "bg-red-50 text-red-600",         icon: "🍳" },
  Education:    { color: "bg-indigo-50 text-indigo-600",   icon: "📚" },
  Driving:      { color: "bg-sky-50 text-sky-600",         icon: "🚗" },
  Singing:      { color: "bg-rose-50 text-rose-600",       icon: "🎤" },
  Photography:  { color: "bg-violet-50 text-violet-600",   icon: "📷" },
  Writing:      { color: "bg-teal-50 text-teal-600",       icon: "✍️" },
  Yoga:         { color: "bg-lime-50 text-lime-600",       icon: "🧘" },
  Gardening:    { color: "bg-emerald-50 text-emerald-600", icon: "🌱" },
  Crafts:       { color: "bg-yellow-50 text-yellow-600",   icon: "🧵" },
  Sports:       { color: "bg-cyan-50 text-cyan-600",       icon: "⚽" },
  Dance:        { color: "bg-fuchsia-50 text-fuchsia-600", icon: "💃" },
  Coding:       { color: "bg-blue-50 text-blue-700",       icon: "👨‍💻" },
  Other:        { color: "bg-gray-100 text-gray-500",      icon: "✨" },
};

export const levelConfig = {
  Beginner:     { color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-400" },
  Intermediate: { color: "bg-amber-50 text-amber-600",     dot: "bg-amber-400"   },
  Advanced:     { color: "bg-red-50 text-red-600",         dot: "bg-red-400"     },
  Expert:       { color: "bg-violet-50 text-violet-600",   dot: "bg-violet-400"  },
};

export default function SkillCard({ skill }) {
  const cat   = categoryConfig[skill.category] ?? categoryConfig.Other;
  const level = levelConfig[skill.level]       ?? levelConfig.Beginner;

  const displayCategory = skill.category === "Other" && skill.customCategory
    ? skill.customCategory
    : skill.category;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3 h-full cursor-pointer">

      {/* Category + Level */}
      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cat.color}`}>
          {cat.icon} {displayCategory}
        </span>
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${level.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${level.dot}`} />
          {skill.level}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 leading-snug">{skill.title}</h3>

      {/* Description */}
      {skill.description && (
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 flex-1">
          {skill.description}
        </p>
      )}

      {/* Owner */}
      {skill.userId?.name && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {skill.userId.name[0].toUpperCase()}
          </div>
          <span className="text-xs text-gray-400 font-medium truncate">{skill.userId.name}</span>
        </div>
      )}
    </div>
  );
}
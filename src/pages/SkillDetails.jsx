import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { createBarter, clearBarterError } from "../features/barters/bartersSlice";
import { categoryConfig, levelConfig } from "../components/SkillCard";

export default function SkillDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { skills } = useSelector((state) => state.skills);
  const { user } = useSelector((state) => state.auth);
  const { error } = useSelector((state) => state.barters);

  const skill = skills.find((s) => s._id === id);
  const mySkills = skills.filter((s) => s.postedBy?._id === user._id);

  const [selectedSkill, setSelectedSkill] = useState("");
  const [requesting, setRequesting] = useState(false);

  if (!skill) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-2xl px-8 py-12 text-center shadow-sm">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm font-semibold text-gray-500">Skill not found</p>
        </div>
      </div>
    );
  }

  const cat   = categoryConfig?.[skill.category] ?? { icon: "✨", color: "bg-gray-100 text-gray-500" };
  const level = levelConfig?.[skill.level]       ?? { color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" };

  const displayCategory = skill.category === "Other" && skill.customCategory
    ? skill.customCategory
    : skill.category;

  const isOwner = skill.postedBy?._id === user._id;

  const handleRequest = async () => {
    if (!selectedSkill) return;
    setRequesting(true);
    const result = await dispatch(
      createBarter({
        receiverId: typeof skill.postedBy === "object" ? skill.postedBy._id : skill.postedBy,
        offeredSkill: selectedSkill,
        neededSkill: skill._id,
      })
    );
    setRequesting(false);
    if (!result.error) {
      dispatch(clearBarterError());
      navigate("/barters");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-10">
      <div className="max-w-xl mx-auto space-y-4">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition border-none bg-transparent cursor-pointer p-0"
        >
          ← Back
        </button>

        {/* Skill Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cat.color}`}>
              {cat.icon} {displayCategory}
            </span>
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${level.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${level.dot}`} />
              {skill.level}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight mb-3">
            {skill.title}
          </h1>

          {/* Description */}
          {skill.description && (
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              {skill.description}
            </p>
          )}

          {/* Posted by */}
          {skill.postedBy?.name && (
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {skill.postedBy.name[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-400">Posted by</p>
                <p className="text-sm font-semibold text-gray-800">{skill.postedBy.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Barter Request */}
        {!isOwner && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Request a Barter</h3>
            <p className="text-xs text-gray-400 mb-4">Offer one of your skills in exchange</p>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <span className="text-sm">⚠️</span>
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {mySkills.length === 0 ? (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-4">
                <p className="text-sm text-amber-600 font-medium">
                  You haven't posted any skills yet.{" "}
                  <button
                    onClick={() => navigate("/")}
                    className="underline border-none bg-transparent cursor-pointer text-amber-600 font-semibold p-0"
                  >
                    Add one first
                  </button>
                </p>
              </div>
            ) : (
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition mb-4 bg-white"
                value={selectedSkill}
                onChange={(e) => {
                  dispatch(clearBarterError());
                  setSelectedSkill(e.target.value);
                }}
              >
                <option value="">Select your skill to offer</option>
                {mySkills.map((s) => (
                  <option key={s._id} value={s._id}>{s.title}</option>
                ))}
              </select>
            )}

            <button
              onClick={handleRequest}
              disabled={!selectedSkill || requesting}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {requesting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending…
                </span>
              ) : "Send Barter Request"}
            </button>
          </div>
        )}

        {/* Owner notice */}
        {isOwner && (
          <div className="bg-violet-50 border border-violet-100 rounded-2xl px-5 py-4 text-sm text-violet-600 font-medium text-center">
            This is your skill listing.
          </div>
        )}

      </div>
    </div>
  );
}
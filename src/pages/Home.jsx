import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSkills, createSkill } from "../features/skills/skillsSlice";
import SkillCard, { categoryConfig } from "../components/SkillCard";
import { Link } from "react-router-dom";

export const CATEGORIES = Object.keys(categoryConfig);
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const initialForm = { title: "", category: "", customCategory: "", level: "Beginner", description: "" };

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition bg-white";

export default function Home() {
  const dispatch = useDispatch();
  const { skills, loading } = useSelector((state) => state.skills);

  const [formData, setFormData] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => { dispatch(fetchSkills()); }, [dispatch]);

  const set = (key) => (e) => setFormData((p) => ({ ...p, [key]: e.target.value }));

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category) return;
    dispatch(createSkill(formData));
    setFormData(initialForm);
    setShowForm(false);
  };

  const filtered = skills.filter((s) => {
    const displayCat = s.category === "Other" && s.customCategory ? s.customCategory : s.category;
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      displayCat.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "All" || s.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Explore Skills</h1>
            <p className="text-sm text-gray-400 mt-1">
              {skills.length} skill{skills.length !== 1 ? "s" : ""} available to swap
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-500 hover:opacity-90 transition shadow-sm"
          >
            <span>{showForm ? "✕" : "+"}</span>
            {showForm ? "Cancel" : "Add Skill"}
          </button>
        </div>

        {/* Category quick-filter pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {["All", ...CATEGORIES].map((cat) => {
            const cfg = categoryConfig[cat];
            const isActive = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition
                  ${isActive
                    ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}
              >
                {cfg?.icon && <span>{cfg.icon}</span>}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            placeholder="Search by title, description or category…"
            className={`${inputCls} pl-10`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Add Skill Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-base font-bold text-gray-800 mb-4">Share a New Skill</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  placeholder="Skill title *"
                  className={inputCls}
                  value={formData.title}
                  onChange={set("title")}
                  required
                />
                <select
                  className={inputCls}
                  value={formData.category}
                  onChange={set("category")}
                  required
                >
                  <option value="">Select a category *</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {categoryConfig[c]?.icon} {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show custom input when Other is selected */}
              {formData.category === "Other" && (
                <input
                  placeholder="Specify your skill (e.g. Driving, Singing, Pottery…) *"
                  className={inputCls}
                  value={formData.customCategory}
                  onChange={set("customCategory")}
                  required
                />
              )}

              <select className={inputCls} value={formData.level} onChange={set("level")}>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>

              <textarea
                placeholder="Describe what you'll teach and what you'd like to learn in return…"
                className={`${inputCls} resize-none`}
                rows={3}
                value={formData.description}
                onChange={set("description")}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-500 hover:opacity-90 transition"
                >
                  Publish Skill
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Skills Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-5 w-24 bg-gray-100 rounded-full" />
                  <div className="h-5 w-16 bg-gray-100 rounded-full" />
                </div>
                <div className="h-4 w-3/4 bg-gray-100 rounded mb-3" />
                <div className="h-3 w-full bg-gray-100 rounded mb-1" />
                <div className="h-3 w-2/3 bg-gray-100 rounded mb-4" />
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <div className="w-6 h-6 bg-gray-100 rounded-full" />
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl py-20 text-center">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-gray-500 font-medium">No skills found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.map((skill) => (
              <Link key={skill._id} to={`/skill/${skill._id}`} className="no-underline">
                <SkillCard skill={skill} />
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
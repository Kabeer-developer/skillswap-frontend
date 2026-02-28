import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBarters,
  updateBarterStatus,
  scheduleSession,
} from "../features/barters/bartersSlice";
import { createReview } from "../features/reviews/reviewsSlice";
import { fetchProfile } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  Pending:   "bg-amber-50 text-amber-600",
  Accepted:  "bg-blue-50 text-blue-600",
  Completed: "bg-emerald-50 text-emerald-600",
  Rejected:  "bg-red-50 text-red-600",
};

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition bg-white";

export default function BarterDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { barters, loading } = useSelector((s) => s.barters);
  const { user } = useSelector((s) => s.auth);

  const [reviewData, setReviewData]     = useState({ rating: 5, comment: "" });
  const [scheduleData, setScheduleData] = useState({ date: "", time: "", mode: "Online" });
  const [openSchedule, setOpenSchedule] = useState(null);
  const [openReview, setOpenReview]     = useState(null);
  const [reviewedBarters, setReviewedBarters] = useState(() => {
    try { return JSON.parse(localStorage.getItem("reviewedBarters") || "[]"); }
    catch { return []; }
  });

  useEffect(() => { dispatch(fetchBarters()); }, [dispatch]);

  const handleStatus = async (id, status) => {
    await dispatch(updateBarterStatus({ id, status }));
    await dispatch(fetchBarters());
    await dispatch(fetchProfile());
  };

  const handleSchedule = async (barterId) => {
    await dispatch(scheduleSession({ id: barterId, data: scheduleData }));
    setScheduleData({ date: "", time: "", mode: "Online" });
    setOpenSchedule(null);
    await dispatch(fetchBarters());
  };

  const handleReview = async (barter) => {
    const senderId   = typeof barter.senderId   === "object" ? barter.senderId._id   : barter.senderId;
    const receiverId = typeof barter.receiverId  === "object" ? barter.receiverId._id : barter.receiverId;
    const revieweeId = senderId === user._id ? receiverId : senderId;
    await dispatch(createReview({ revieweeId, barterId: barter._id, ...reviewData }));
    setReviewData({ rating: 5, comment: "" });
    setOpenReview(null);
    const updated = [...reviewedBarters, barter._id];
    setReviewedBarters(updated);
    try { localStorage.setItem("reviewedBarters", JSON.stringify(updated)); } catch {}
    await dispatch(fetchProfile());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-5 py-10">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Barters</h1>
          <p className="text-sm text-gray-400 mt-1">
            {barters.length} exchange{barters.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                  <div className="h-5 w-16 bg-gray-100 rounded-full" />
                </div>
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && barters.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl py-20 text-center">
            <p className="text-3xl mb-2">🔄</p>
            <p className="text-sm font-medium text-gray-400">No barters yet</p>
            <p className="text-xs text-gray-300 mt-1">Start by sending a barter request</p>
          </div>
        )}

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {barters.map((barter) => {
            const receiverId = typeof barter.receiverId === "object" ? barter.receiverId._id : barter.receiverId;
            const isReceiver = receiverId === user._id;
            const { status } = barter;
            const alreadyReviewed = reviewedBarters.includes(barter._id) || barter.reviewedByMe;

            return (
              <div key={barter._id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

                {/* Top */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">
                    #{barter._id.slice(-8).toUpperCase()}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusConfig[status] ?? "bg-gray-100 text-gray-500"}`}>
                    {status}
                  </span>
                </div>

                {/* Skill swap titles */}
                {(barter.senderSkill?.title || barter.receiverSkill?.title) && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-sm font-semibold text-gray-800 truncate">{barter.senderSkill?.title}</span>
                    <span className="text-gray-300 font-bold flex-shrink-0">↔</span>
                    <span className="text-sm font-semibold text-gray-800 truncate">{barter.receiverSkill?.title}</span>
                  </div>
                )}

                {/* Sessions */}
                {barter.sessions?.length > 0 && (
                  <>
                    <hr className="border-gray-100 my-4" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Sessions</p>
                    <div className="flex flex-col gap-2">
                      {barter.sessions.map((s, i) => (
                        <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-600">
                          <span>📅 {s.date}</span>
                          <span className="text-gray-400">⏰ {s.time}</span>
                          <span className="text-gray-400">{s.mode}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* ── Pending ── */}
                {status === "Pending" && isReceiver && (
                  <>
                    <hr className="border-gray-100 my-4" />
                    <div className="flex gap-2">
                      <button onClick={() => handleStatus(barter._id, "Accepted")}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors border-none cursor-pointer">
                        Accept
                      </button>
                      <button onClick={() => handleStatus(barter._id, "Rejected")}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors border-none cursor-pointer">
                        Reject
                      </button>
                    </div>
                  </>
                )}

                {/* ── Accepted ── */}
                {status === "Accepted" && (
                  <>
                    <hr className="border-gray-100 my-4" />
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => handleStatus(barter._id, "Completed")}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors border-none cursor-pointer">
                        Mark Completed
                      </button>
                      <button onClick={() => navigate(`/chat/${barter._id}`)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gray-800 hover:bg-gray-900 transition-colors border-none cursor-pointer">
                        Open Chat
                      </button>
                      <button onClick={() => setOpenSchedule(openSchedule === barter._id ? null : barter._id)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors border-none cursor-pointer">
                        {openSchedule === barter._id ? "Cancel" : "Schedule Session"}
                      </button>
                    </div>

                    {openSchedule === barter._id && (
                      <div className="mt-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">New Session</p>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <input type="date" className={inputCls} value={scheduleData.date}
                            onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })} />
                          <input type="time" className={inputCls} value={scheduleData.time}
                            onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })} />
                        </div>
                        <select className={`${inputCls} mb-3`} value={scheduleData.mode}
                          onChange={(e) => setScheduleData({ ...scheduleData, mode: e.target.value })}>
                          <option value="Online">Online</option>
                          <option value="In-Person">In-Person</option>
                        </select>
                        <button onClick={() => handleSchedule(barter._id)}
                          className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors border-none cursor-pointer">
                          Add Session
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* ── Completed ── */}
                {status === "Completed" && (
                  <>
                    <hr className="border-gray-100 my-4" />
                    {alreadyReviewed ? (
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                        <span>✅</span> Review submitted
                      </div>
                    ) : (
                      <>
                        <button onClick={() => setOpenReview(openReview === barter._id ? null : barter._id)}
                          className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors border-none cursor-pointer">
                          {openReview === barter._id ? "Cancel" : "Leave a Review"}
                        </button>

                        {openReview === barter._id && (
                          <div className="mt-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Your Review</p>
                            <select className={`${inputCls} mb-3`} value={reviewData.rating}
                              onChange={(e) => setReviewData({ ...reviewData, rating: Number(e.target.value) })}>
                              {[5, 4, 3, 2, 1].map((n) => (
                                <option key={n} value={n}>{"★".repeat(n)} {n} star{n !== 1 ? "s" : ""}</option>
                              ))}
                            </select>
                            <textarea
                              className={`${inputCls} resize-none mb-3`}
                              rows={3}
                              placeholder="Share your experience…"
                              value={reviewData.comment}
                              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                            />
                            <button onClick={() => handleReview(barter)}
                              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors border-none cursor-pointer">
                              Submit Review
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
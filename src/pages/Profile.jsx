import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchReviews } from "../features/reviews/reviewsSlice";
import { fetchProfile } from "../features/auth/authSlice";
import ReviewCard, { getInitials, Stars } from "../components/ReviewCard";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.reviews);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(fetchProfile()); }, [dispatch]);

  useEffect(() => {
    if (user?._id) dispatch(fetchReviews(user._id));
  }, [dispatch, user?._id]);

  if (!user) return null;

  const trustScore = Number(user.trustScore ?? 0);

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm mb-6">

          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {getInitials(user.name)}
            </div>
            <div>
              <p className="text-lg font-extrabold text-gray-900 tracking-tight leading-none">{user.name}</p>
              <p className="text-sm text-gray-400 mt-1">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Credits</p>
              <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{user.credits ?? 0}</p>
              <p className="text-xs text-gray-400 mt-1">available balance</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Trust Score</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{trustScore.toFixed(1)}</p>
                <Stars rating={Math.round(trustScore)} size="text-base" />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 tracking-tight">Reviews Received</h3>
          {reviews.length > 0 && (
            <span className="text-xs text-gray-400 font-medium">{reviews.length} total</span>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl py-14 text-center">
            <p className="text-2xl mb-2">⭐</p>
            <p className="text-sm font-medium text-gray-400">No reviews yet</p>
            <p className="text-xs text-gray-300 mt-1">Complete a barter to receive your first review</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
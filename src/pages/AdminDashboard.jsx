import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const statusConfig = {
  Pending:   "bg-amber-50 text-amber-600",
  Accepted:  "bg-blue-50 text-blue-600",
  Completed: "bg-emerald-50 text-emerald-600",
  Rejected:  "bg-red-50 text-red-600",
};

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(str) {
  return new Date(str).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [barters, setBarters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  if (!user || user.role !== "Admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-red-200 rounded-2xl px-8 py-10 text-center shadow-sm">
          <p className="text-2xl mb-2">🚫</p>
          <p className="text-base font-bold text-red-600">Access Denied</p>
          <p className="text-sm text-gray-400 mt-1">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const token = user.token;
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/users", { headers });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBarters = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/barters", { headers });
      setBarters(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBan = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/ban/${id}`, {}, { headers });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBarters();
  }, []);

  const stats = [
    { label: "Total Users",    value: users.length,                          icon: "👥" },
    { label: "Active Users",   value: users.filter((u) => !u.isBanned).length, icon: "✅" },
    { label: "Banned Users",   value: users.filter((u) => u.isBanned).length,  icon: "🚫" },
    { label: "Total Barters",  value: barters.length,                          icon: "🔄" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Manage users and monitor barter activity</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
              <p className="text-xl mb-1">{s.icon}</p>
              <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{s.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["users", "barters"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize border transition-colors ${
                activeTab === tab
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab === "users" ? `👥 Users (${users.length})` : `🔄 Barters (${barters.length})`}
            </button>
          ))}
        </div>

        {/* Users Table */}
        {activeTab === "users" && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 text-center">
                <p className="text-sm text-gray-400 animate-pulse">Loading users…</p>
              </div>
            ) : users.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm text-gray-400">No users found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wide">
                      <th className="px-5 py-3 text-left">User</th>
                      <th className="px-5 py-3 text-left">Credits</th>
                      <th className="px-5 py-3 text-left">Trust Score</th>
                      <th className="px-5 py-3 text-left">Status</th>
                      <th className="px-5 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full  from-violet-500 to-blue-400 flex items-center justify-center text-white text-xs font-bold ">
                              {getInitials(u.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 leading-none">{u.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="font-semibold text-gray-700">{u.credits}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="font-semibold text-gray-700">
                            ⭐ {Number(u.trustScore ?? 0).toFixed(1)}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            u.isBanned
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}>
                            {u.isBanned ? "Banned" : "Active"}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => toggleBan(u._id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border-none cursor-pointer ${
                              u.isBanned
                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                          >
                            {u.isBanned ? "Unban" : "Ban"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Barters Table */}
        {activeTab === "barters" && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {barters.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm text-gray-400">No barters found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wide">
                      <th className="px-5 py-3 text-left">Sender</th>
                      <th className="px-5 py-3 text-left">Receiver</th>
                      <th className="px-5 py-3 text-left">Status</th>
                      <th className="px-5 py-3 text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {barters.map((b) => (
                      <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full  from-violet-500 to-blue-400 flex items-center justify-center text-white text-xs font-bold ">
                              {getInitials(b.senderId?.name)}
                            </div>
                            <span className="font-medium text-gray-800">{b.senderId?.name ?? "—"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full  from-pink-500 to-rose-400 flex items-center justify-center text-white text-xs font-bold ">
                              {getInitials(b.receiverId?.name)}
                            </div>
                            <span className="font-medium text-gray-800">{b.receiverId?.name ?? "—"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig[b.status] ?? "bg-gray-100 text-gray-500"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-xs font-medium">
                          {formatDate(b.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
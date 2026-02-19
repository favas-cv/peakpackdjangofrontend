import React, { useState, useEffect } from "react";
import useFetch from "../../../Customhooks/Fetchinghook";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axiosInstance";
import { FaPencilAlt, FaTrashAlt, FaBan } from "react-icons/fa";

function Userslayout() {
  const [page, setpage] = useState(1);
  const { data: users,error, loading } = useFetch(`/accounts/userslist/?page=${page}`);
  const [userlist, setuserlist] = useState([]);

  useEffect(() => {
    if (users?.results) setuserlist(users.results);
  }, [users]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axiosInstance.delete(`/accounts/userslist/${id}/`);
      setuserlist(prev => prev.filter(u => u.id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleBlock = async (user) => {
    try {
      const res = await axiosInstance.patch(`/accounts/userslist/${user.id}/`, {
        is_active: !user.is_active
      });

      setuserlist(prev => prev.map(u => u.id === user.id ? res.data : u));
      toast.success(`User ${res.data.is_active ? "Unblocked" : "Blocked"}`);
    } catch {
      toast.error("Operation failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lime-600 font-bold tracking-widest">
        LOADING USERS...
      </div>
    );

    if (error) return <div className="text-red-500 p-10 text-center font-bold">Error loading users.</div>;

        {
        !loading && !error && userlist.length === 0 && (
            <div className="text-center mt-10">
                <h2 className="text-xl font-semibold text-gray-600">
                    No Users Found
                </h2>
               
            </div>
        )
    }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen border-t-4 border-lime-500">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-black text-sky-950 tracking-tight uppercase">
          PeakPack <span className="text-lime-500">Users</span>
        </h1>
        <p className="text-gray-500 font-medium">
          Manage platform members & permissions
        </p>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-sky-950">
              <tr>
                <th className="p-5 text-xs font-bold text-white uppercase">Email</th>
                <th className="p-5 text-xs font-bold text-white uppercase">Joined</th>
                <th className="p-5 text-xs font-bold text-white uppercase">Role</th>
                <th className="p-5 text-xs font-bold text-white uppercase">Status</th>
                <th className="p-5 text-xs font-bold text-white uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {userlist.map(user => (
                <tr key={user.id} className="hover:bg-lime-50/20 transition">
                  
                  <td className="p-5 font-semibold text-sky-950">
                    {user.email}
                  </td>

                  <td className="p-5 text-gray-600">
                    {new Date(user.date_joined).toLocaleDateString()}
                  </td>

                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                      user.is_staff 
                        ? "bg-sky-100 text-sky-900" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {user.is_staff ? "Admin" : "User"}
                    </span>
                  </td>

                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      user.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {user.is_active ? "Active" : "Blocked"}
                    </span>
                  </td>

                  <td className="p-5">
                    <div className="flex justify-center gap-4">

                      <button
                        onClick={() => handleBlock(user)}
                        className="p-2.5 bg-gray-50 text-gray-700 hover:bg-gray-700 hover:text-white rounded-lg transition"
                        title="Block / Unblock"
                      >
                        <FaBan size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition"
                        title="Delete"
                      >
                        <FaTrashAlt size={14} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
            Page <span className="text-sky-950 font-black">{page}</span>
          </span>

          <div className="flex gap-2">
            <button
              disabled={!users?.previous}
              onClick={() => setpage(p => p - 1)}
              className="px-4 py-2 border-2 border-sky-950 text-sky-950 rounded-lg text-xs font-black hover:bg-sky-950 hover:text-white disabled:opacity-30 transition uppercase"
            >
              ← Prev
            </button>

            <button
              disabled={!users?.next}
              onClick={() => setpage(p => p + 1)}
              className="px-4 py-2 bg-sky-950 border-2 border-sky-950 text-lime-500 rounded-lg text-xs font-black hover:bg-lime-500 hover:text-sky-950 hover:border-lime-500 disabled:opacity-30 transition uppercase"
            >
              Next →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Userslayout;

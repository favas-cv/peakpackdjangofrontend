import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaSignOutAlt, FaBoxOpen, FaStore, FaUserShield, FaIdBadge } from "react-icons/fa";
import { toast } from "react-toastify";
import { Usercontext } from "../context/Usercontext";
import { Bagcontext } from "../context/Bagcontext";
import { Favoritescontext } from "../context/Favoritescontext";
import axiosInstance from "../api/axiosInstance";

function Profilepage() {
  const nav = useNavigate();
  const { user, setuser } = useContext(Usercontext);
  const { favCount } = useContext(Favoritescontext);
  const { bagCount, loading } = useContext(Bagcontext);

  const logouting = async () => {
    try {
      await axiosInstance.post('accounts/logout/');
    } catch (error) {
      console.log(error);
    }
    toast.success("Logged out successfully 👋");
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    setuser(null);
    nav("/", { replace: true });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white p-6 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FaIdBadge className="text-4xl text-gray-300" />
        </div>
        <h2 className="text-xl font-black text-sky-950 tracking-tight">ACCESS DENIED</h2>
        <p className="text-gray-500 text-sm mt-2 mb-6">Please login to view your PeakPack profile.</p>
        <button
          className="bg-sky-950 text-white font-bold px-8 py-3 rounded-xl hover:bg-lime-500 hover:text-sky-950 transition-all duration-300"
          onClick={() => nav("/loginpage")}
        >
          LOGIN NOW
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-10 min-h-screen">
      
      {/* Premium Compact Header */}
      <div className="bg-sky-950 rounded-[2rem] p-6 shadow-2xl mb-6 relative overflow-hidden">
        {/* Subtle Lime Glow */}
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-lime-500/10 rounded-full blur-2xl"></div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* User ID Section */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-lime-500 text-sky-950 flex items-center justify-center rounded-2xl text-2xl font-black shadow-lg shadow-lime-500/20">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-black text-white tracking-tight uppercase">
                {user.username}
              </h2>
              <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                <span className="px-2 py-0.5 bg-white/10 text-lime-400 text-[10px] font-bold rounded uppercase tracking-wider">
                   {user.is_staff ? "Admin Access" : "Explorer"}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">ID: {user.id}</span>
              </div>
            </div>
          </div>

          {/* Original Stats Previews */}
          <div className="flex gap-3">
            <div 
              onClick={() => nav("/bag")}
              className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 cursor-pointer transition-all"
            >
              <FaShoppingCart className="text-lime-500" />
              <span className="text-white font-bold">{bagCount}</span>
            </div>
            <div 
              onClick={() => nav("/favorites")}
              className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 cursor-pointer transition-all"
            >
              <FaHeart className="text-red-400" />
              <span className="text-white font-bold">{favCount}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        <button
          onClick={() => nav("/orderconfirmation")}
          className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-lime-500 transition-all shadow-sm group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-50 text-sky-950 rounded-xl flex items-center justify-center group-hover:bg-sky-950 group-hover:text-white transition-all">
              <FaBoxOpen />
            </div>
            <span className="font-bold text-sky-950">My Orders</span>
          </div>
          <span className="text-gray-300 group-hover:text-lime-500 transition-colors">→</span>
        </button>

        <button
          onClick={() => nav("/shop")}
          className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-lime-500 transition-all shadow-sm group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-50 text-sky-950 rounded-xl flex items-center justify-center group-hover:bg-sky-950 group-hover:text-white transition-all">
              <FaStore />
            </div>
            <span className="font-bold text-sky-950">Explore Shop</span>
          </div>
          <span className="text-gray-300 group-hover:text-lime-500 transition-colors">→</span>
        </button>

        <button
          onClick={logouting}
          className="sm:col-span-2 flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all mt-2"
        >
          <FaSignOutAlt /> SIGN OUT
        </button>

      </div>

      <div className="mt-10 text-center">
        <p className="text-[10px] font-black text-gray-300 tracking-[0.3em] uppercase">
          PeakPack © 2026 Verified Account
        </p>
      </div>

    </div>
  );
}

export default Profilepage;
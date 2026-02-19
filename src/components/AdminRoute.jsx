// src/components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import NotAuthorizedAdmin from "../pages/NotAuthorizedAdmin";
import useFetch from "../Customhooks/Fetchinghook";

const AdminRoute = ({ children }) => {
  const {data : storedUser,loading } = useFetch('accounts/profile/')

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-950"></div>
      </div>
    );
  }

  // not logged in  go to login
  if (!storedUser) return <Navigate to="/Loginpage" replace />;

  // logged in but not admin  show NotAuthorized component
  if (!storedUser.is_staff) return <NotAuthorizedAdmin />;

  // admin  show the children
  return children;
};

export default AdminRoute;

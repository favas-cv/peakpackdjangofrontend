// src/components/UserRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import NotAuthorizedUser from "../pages/NotAuthorizedUser";
import { Usercontext } from "../context/Usercontext";
import { useContext } from "react";
import useFetch from "../Customhooks/Fetchinghook";

const UserRoute = ({ children }) => {
  // const storedUser = localStorage.getItem("user");
  // const user = storedUser ? JSON.parse(storedUser) : null;
  const { user,loading } = useContext(Usercontext);
  // const {data:user,loading} = useFetch('accounts/profile/')

  if (loading) {
    return <div className="'loading">sessions are checking....</div>
     
  }

//if not work uncomment 

  if (!user) return <Navigate to="/Loginpage" replace />;

  if (user.is_staff) return <NotAuthorizedUser />;

  return children;
};

export default UserRoute;

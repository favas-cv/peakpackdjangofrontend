import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Usercontext } from "../context/Usercontext";

function Loginpage() {
  const nav = useNavigate();
  const { setuser } = useContext(Usercontext); // Removed 'user' as it's not directly used here
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});

  async function HandleLogin(e) {
    e.preventDefault(); 
    setError({}); 

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      // const res = await axios.post(
      //   `https://peakpackbackend.onrender.com/users?email=${email}&password=${password}`
      // );

      // if (res.data.length > 0) {
      //   const loggeduser = res.data[0];

        // if (loggeduser.status === "blocked") {
        //   toast.error("You are blocked by the admin. Please contact support.", { toastId: "blockedUser" });
        //   return;
        // }

      const res = await axios.post(
        'http://127.0.0.1:8000/accounts/login/',
        {
            username:email,
            password:password
        },
          {withCredentials:true}
        );

        // localStorage.setItem("user", JSON.stringify(loggeduser));
        // setuser(loggeduser);

      localStorage.setItem('access_token',res.data.access);
      localStorage.setItem('user',JSON.stringify(res.data.user))
      setuser(res.data.user)
      console.log(res.data.user)
      if(res.data.user.is_staff){
        nav('/admin/dashboard',{replace:true});
      }else{

        nav('/',{replace:true})
      }

      toast.success('login successfull')


      // if (loggeduser.role === "admin") {
      //     toast.info("Welcome Admin", { toastId: "adminLogin" });
      //     nav("/admin/dashboard");
      //   } else {
      //     nav("/");
      //     toast.success("Welcome " + loggeduser.name, { toastId: "userWelcome" });
      //   }
      // } else {
      //   toast.error("Invalid email or password. Please try again.", { toastId: "loginError" });
      // }
    } catch (err) {

      if (err.response?.data){
        setError(err.response?.data);

      }else{
        setError({general:"Server error. Try again."})
      }
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/images/shadowbg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#c1e3b9ff' // Fallback color
      }}

    >     
     <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/images/loginreglogo.jpg"
            alt="PEAKPACK Logo"
            className="h-35 mb-2"
          />
          <h1 className="text-3xl font-extrabold text-center text-sky-950">
            Welcome Back!
          </h1>
        </div>

        {error.detail && (
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-center text-sm">
            {error.detail}
          </p>
        )}
        {error.general && (
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-center text-sm">
            {error.general}
          </p>
        )}

        <form className="flex flex-col space-y-5" onSubmit={HandleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950 focus:border-transparent placeholder-gray-500 transition duration-200 text-gray-800"
            aria-label="Email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950 focus:border-transparent placeholder-gray-500 transition duration-200 text-gray-800"
            aria-label="Password"
          />

          <div className="text-right"> {/* Align "Forgot password" to the right */}
            <Link
              to="/forgotpassword"
              className="font-medium text-sky-950 hover:text-teal-800 hover:underline transition duration-200 text-sm"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-lime-500 hover:bg-sky-950 text-white font-bold py-3 px-5 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Don't have an account?{" "}
          <Link
            to="/registerpage"
            className="font-semibold text-sky-950 hover:text-teal-800 hover:underline transition duration-200"
          >
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Loginpage;
import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function Resetpassword() {
    
    const location=useLocation();
    const query = new URLSearchParams(location.search)
    const token  = query.get('token')
    const nav = useNavigate();


    const [password, setpassword] = useState("");
    const [password2, setpassword2] = useState("");
    const [error, seterror] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        seterror(""); // ✅ clear previous error

        // ✅ Validation
        if (!password || !password2) {
            seterror("All fields are required.");
            return;
        }

        if (password.length < 8) {
            seterror("Password must be at least 8 characters.");
            return;
        }

        if (password !== password2) {
            seterror("Passwords do not match.");
            return;
        }

        try {
            await axiosInstance.post("/passwordreset/confirm/", {
                token: token,
                password: password
            });

            

            toast.success("Password reset successful");
            nav('/loginpage');

        } catch (err) {
            const message =
                err.response?.data?.password?.[0] ||
                err.response?.data?.token?.[0] ||
                "Invalid or expired token. Please try again.";

            seterror(message);
            toast.error(message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded w-96">
                <h2 className="text-xl font-bold mb-4">Set New Password</h2>

                <input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => {
                        setpassword(e.target.value);
                        seterror("");  
                    }}
                    className="w-full p-2 border rounded mb-3"
                />

                <input
                    type="password"
                    placeholder="Confirm password"
                    value={password2}
                    onChange={(e) => {
                        setpassword2(e.target.value);
                        seterror(""); 
                    }}
                    className="w-full p-2 border rounded mb-3"
                />

                {error && (
                    <p className="text-red-500 text-sm mb-3">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full bg-green-700 text-white p-2 rounded"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}

export default Resetpassword;

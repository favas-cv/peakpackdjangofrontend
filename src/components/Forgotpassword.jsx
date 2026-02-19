import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function Forgotpassword() {
    // const URL = "https://peakpackbackend.onrender.com/users";
    const [loading, setloading] = useState(false);
    const [email, setemail] = useState('');
    const [error, seterror] = useState(null);
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const res = await axios.get(`${URL}?email=${email}`)
        setloading(true)

        try {

            await axiosInstance.post('/passwordreset/', {
                email
            })
            toast.success("Reset link sent to your email , succssfully.")



        } catch (err) {
            
            // console.log("DATA:", err.response?.data);

            if (err.response?.data) {
                seterror(err.response.data.email[0].split(".")[0])
                
            } else {
                toast.error("Something went wrong");
            }
        }

        setloading(false)


    }

    return (
        <>
            <div className="flex p-4 min-h-screen justify-center items-center h-screen bg-gray-100">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-lg p-6 rounded max-w-md w-full mx-4 ms:mx-auto"
                >
                    <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>
                    {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full mb-3 sm:mb-4 px-3 py-2 border rounded-md"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                    />



                    <button
                        type="submit"
                        className="w-full bg-green-800 hover:bg-orange-500 text-white font-bold py-2 rounded-md"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            </div>


        </>)
}

export default Forgotpassword
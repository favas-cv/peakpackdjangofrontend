import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
 
function Registerpage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const [error, setError] = useState({});

    const nav = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        setError({})

        if ( !email || !password) {
            setError({"general":"All fields are required."})
            return;
        }

        // if (name.length < 3) {
        //     setError('Name must be at least 3 characters.')
        //     return;
        // }

        // const Emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!Emailpattern.test(email)) {
        //     setError('Please enter a valid email address.')
        //     return;
        // }

        // if (password.length < 6) {
        //     setError('Password must be at least 6 characters.')
        //     return;
        // }

        try {

            // const res = await axios.get(`http://127.0.0.1:8000/accounts/register/?email=${email}`);
            // if (res.data.length > 0) {
            //     setError('Email already registered. Please login.');
            //     return;
            // }

            // const Newuser = { name, email, password, status, bag, favorites, orders, role };
            const Newuser = {
                username:email,
                email:email,
                password:password,
                password2:password2
            }

            await axios.post('https://peakpack.ddns.net/accounts/register/', Newuser);
            toast.success('Registration successful! You can now log in.', {
                toastId: 'Registersuccess'
            });
            setError({});
            setEmail('');
            setPassword('');
            nav("/loginpage");

        } catch (err) {
            if (err.response && err.response.data) {
                // 🔹 This captures the Django error dictionary
                setError(err.response.data);
                console.log("Backend Validation Errors:", err.response.data);
            } else {
                setError({ general: "Server is unreachable. Try again later." });
            }
        }
    }

    return (
        // Main container with background image
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
                        src='/images/loginreglogo.jpg'
                        alt="PEAKPACK Logo"
                        className="h-35 mb-2" // Smaller height for a cleaner look
                    />
                </div>

                <h1 className="text-3xl font-extrabold text-center text-sky-950 mb-7">
                    Join the Adventure
                </h1>

                {error.general && (
                    <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-center text-sm">
                        {error}
                    </p>
                )}

                <form onSubmit={handleRegister} className="flex flex-col space-y-5">
                    {/* <input
                        className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950 focus:border-transparent placeholder-gray-500 transition duration-200 text-gray-800"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        aria-label="Full Name"
                        /> */}
                        {(error.email || error.username) && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{error.email?.[0] || error.username?.[0]}</p>
                            )}
                    <input
                        className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950 focus:border-transparent placeholder-gray-500 transition duration-200 text-gray-800"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        aria-label="Email Address"
                    />
                        {error.password && <p className="text-red-500 text-xs mt-1 ml-1">{error.password[0]}</p>}
                    <input
                        className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950 focus:border-transparent placeholder-gray-500 transition duration-200 text-gray-800"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        aria-label="Password"
                    />
                        {error.password2 && <p className="text-red-500 text-xs mt-1 ml-1">{error.password2}</p>}
                    <input
                        className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950 focus:border-transparent placeholder-gray-500 transition duration-200 text-gray-800"
                        type="password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        placeholder="Password2"
                        aria-label="Password2"
                    />

                    {/* Terms and Conditions Checkbox */}
                    <div className="flex items-center mt-2 mb-4">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            className="h-4 w-4 text-ssky-950 focus:ring-sky-950 border-gray-300 rounded"
                            required
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 select-none">
                            I agree to the <Link href="#" className="font-medium text-sky-950 hover:text-teal-700">Terms & Conditions</Link>
                        </label>
                    </div>

                    <button
                        className="w-full bg-lime-500 hover:bg-sky-950 text-white font-bold py-3 px-5 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        type="submit"
                    >
                        Register
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-6 text-center">
                    Already have an account?{' '}
                    <Link
                        to='/loginpage'
                        className="font-semibold text-sky-950 hover:text-teal-700 hover:underline transition duration-200"
                    >
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Registerpage;
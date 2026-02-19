import React, { useContext, useEffect, useState } from 'react';
import { Favoritescontext } from '../context/Favoritescontext';
import { Bagcontext } from '../context/Bagcontext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Usercontext } from '../context/Usercontext';

function Favoritespage() {
  const { favItems, addtoFav, removefromFav,clearFav,  loading } = useContext(Favoritescontext);
  const { addtoBag } = useContext(Bagcontext);
  const { user, setuser } = useContext(Usercontext);
  const nav = useNavigate();

 if (loading) {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-lime-500"></div>
        <p className="text-sky-950 text-lg font-semibold animate-pulse mt-2">
          Please wait, your favorites are loading...
        </p>
      </div>
    </div>
  );
}

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        <p className="text-xl text-gray-700 font-medium mb-4">You need to be logged in to view your favorites.</p>
        <button
          className="bg-lime-500 hover:bg-sky-950 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out"
          onClick={() => nav("/loginpage")}
        >
          Login
        </button>
      </div>
    );
  }

  if (favItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-white p-4">
        <div className="w-64 h-64 mb-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-full h-full text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-700 mb-3">Your Favorites List is Empty!</h2>
        <p className="text-lg text-gray-500 text-center max-w-md">
          Looks like you haven't added anything to your favorites yet.
          Start exploring to find items you love!
        </p>
        <button
          onClick={() => nav('/shop')} // Assuming '/' is your home/products page
          className="mt-8 bg-lime-500 hover:bg-sky-950 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800 text-center lg:text-left">My Favorites</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="relative w-full h-48 sm:h-56 bg-gray-100 flex items-center justify-center p-4">
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate">{item.name}</h2>
              <div className="flex items-center justify-between mb-4 mt-auto">
                <p className="text-lg font-bold text-gray-800">
                  ${item.product.price}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    addtoBag(item.product);
                  }}
                  className="flex-1 px-5 py-2 rounded-lg bg-lime-500 text-white font-medium hover:bg-sky-950 focus:outline-none focus:ring-2 focus:ring-teal-300 transition duration-200 ease-in-out text-center"
                >
                  Add to Bag
                </button>
                <button
                  onClick={() => {
                    removefromFav(item.product.id);
                    toast.info(`${item.product.name} removed from favorites!`);
                  }}
                  className="flex-1 px-5 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 ease-in-out text-center"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => {
            clearFav();
            toast.info("All favorites cleared!");
          }}
          className="px-8 py-3 rounded-lg border-2 border-red-500 text-red-600 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-200 ease-in-out"
        >
          Clear All Favorites
        </button>
      </div>
    </div>
  );
}

export default Favoritespage;
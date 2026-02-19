import React, { useContext, useState, useEffect } from 'react';
import { Bagcontext } from '../context/Bagcontext';
import { useNavigate } from 'react-router-dom';
import { Usercontext } from '../context/Usercontext';

function Bagpage() {
  const { bagItems, subtotal, charge, removefromBag, increaseQuantity, decreaseQuantity, bagTotal, loading } = useContext(Bagcontext);
  const nav = useNavigate();
  const { user } = useContext(Usercontext);

  //Loading
  if (loading ) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-white/70 z-50">
        <div className="relative w-20 h-20">
          <div className="absolute w-full h-full border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sky-950 text-lg font-semibold animate-pulse mt-4">
          Please wait, your Bag is loading...
        </p>
      </div>
    );
  }


//not user
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        <p className="text-xl text-gray-700 font-medium mb-4">You need to be logged in to view your bag.</p>
        <button
          className="bg-lime-500 hover:bg-sky-950 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out"
          onClick={() => nav("/loginpage")}
        >
          Login Now
        </button>
      </div>
    );
  }

  // emptybag 
  if (bagItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-white p-4">
        <div className="w-64 h-64 mb-8 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-full h-full text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-700 mb-3">Your Shopping Bag is Empty!</h2>
        <p className="text-lg text-gray-500 text-center max-w-md">
          Time to fill it up with amazing products. Start browsing now!
        </p>
        <button
          onClick={() => nav('/')}
          className="mt-8 bg-lime-500 hover:bg-sky-950 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800 text-center lg:text-left"> My Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {bagItems.map((item) => (

            <div 
              key={item.id} 
              className="flex flex-col sm:flex-row items-center justify-between rounded-xl p-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                <img src={item.product.image_url} alt={item.product.name} className="w-24 h-24 object-contain rounded-lg border border-gray-200" />
                <div className="flex flex-col gap-1">
                  <h2 className="font-semibold text-xl text-gray-800">{item.product.name}</h2>
                  <p className="text-gray-600 text-base">Price: <span className="font-bold text-gray-900">${item.product.price}</span></p>
                  <p className="text-gray-600 text-base">Subtotal: <span className="font-bold text-gray-900">${Math.round(subtotal)}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => decreaseQuantity(item.product.id)}
                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-800 font-semibold border-x border-gray-300">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQuantity(item.product.id)}
                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => removefromBag(item)}
                  className="p-2 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-200"
                  aria-label="Remove from bag"
                >
                  <img src='/images/trash.png' alt="Remove item" className="w-8 h-8" />
                </button>

              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 rounded-xl p-6 shadow-lg bg-white h-fit sticky top-24">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="font-semibold">${Math.round(bagTotal)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery:</span>
              <span className="font-semibold">${charge}</span>
            </div>
            <hr className="my-4 border-gray-200" />
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total:</span>
              <span>${Math.round(subtotal)}</span>
            </div>
          </div>
          <button
            className="mt-6 w-full py-3 rounded-lg bg-lime-500 text-white font-semibold hover:bg-sky-950 transition-colors duration-300 ease-in-out shadow-md"
            onClick={() => nav('/orderdetailpage')}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bagpage;
import React, { useContext, useEffect, useState } from "react";
import { Bagcontext } from "../context/Bagcontext";
import { Usercontext } from "../context/Usercontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";


function Orderconfirmationpage() {
  const nav = useNavigate();
  // const { URL } = useContext(Bagcontext); // Removed bagItems, subtotal, charge, clearBag as they are not needed here
  const { user } = useContext(Usercontext);

  const [previousOrders, setPreviousOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  // useEffect(() => {
  //   if (user) {
  //     axiosInstance
  //       .get('orders/userorder/')
  //       .then((res) => {
  //         // Set previous orders, reversed to show most recent first
  //         setPreviousOrders((res.data.results).reverse());
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         toast.error("Failed to fetch orders.");
  //         setLoading(false);
  //       });
  //   } else {
  //     setLoading(false); // If no user, stop loading
  //   }
  // }, [user]);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const res = await axiosInstance.get("orders/userorder/");
          setPreviousOrders(res.data.results.reverse());
        } catch (error) {
          toast.error("Failed to fetch orders");
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);


  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        <p className="text-xl text-gray-700 font-medium mb-4">You must be logged in to view your orders.</p>
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out"
          onClick={() => nav("/loginpage")}
        >
          Login Now
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mb-4"></div>
        <p className="text-lg text-gray-700">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800 text-center lg:text-left">Your Orders</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {previousOrders.length > 0 ? (
          <div className="space-y-8">
            {previousOrders.map((order, index) => (
              <div key={index} className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                  <h3 className="font-bold text-lg text-gray-800">Order #{index + 1}</h3>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full 
                    ${order.status === "PENDING" ? "bg-orange-100 text-orange-700" :
                      order.status === "DELIVERED" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-5">
                  <div>
                    <p><span className="font-semibold">Order Date:</span> {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p><span className="font-semibold">Payment Method:</span> {order.paymentmethod}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Delivery Address:</p>
                    <p>{order.address?.streetAddress}</p>
                    <p>{order.address?.city}</p>
                    <p>{order.address?.pincode}</p>
                    <p>📞 {order.address?.phone}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-5 border-t pt-4">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4"
                    >

                      <div className="flex items-center gap-3">

                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-14 h-14 object-cover rounded-md border border-gray-200"
                        />

                        <div>
                          <p className="font-medium text-gray-800">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>

                      </div>

                      <p className="font-semibold text-gray-800">
                        ${(item.order_time_price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>




                <div className="bg-gray-100 p-3 rounded-lg mt-4 text-gray-700">
                  <p className="flex justify-between">
                    <span>Subtotal:</span> <span>${(order.subtotal).toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Delivery:</span> <span>${order.delivery.toFixed(2)}</span>
                  </p>
                  <hr className="my-2 border-gray-200" />
                  <p className="flex justify-between font-bold text-lg text-gray-900">
                    <span>Total:</span> <span>${order.total.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-600">
            <span className="text-6xl mb-6">📦</span> {/* Box emoji */}
            <p className="text-xl font-medium mb-3">No orders found yet!</p>
            <p className="text-md mb-6 text-center max-w-sm">
              It looks like you haven't placed any orders with us.
              Start exploring our amazing products!
            </p>
            <button
              onClick={() => nav("/")}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orderconfirmationpage;
import React, { useEffect, useState } from "react";
import useFetch from "../../../Customhooks/Fetchinghook";
import axios from "axios";
import { toast } from "react-toastify";
import { sync } from "framer-motion";
import axiosInstance from "../../../api/axiosInstance";

function Orderslayout() {
  const [page, setpage] = useState(1)
  const { data: orders, loading, error } = useFetch(`/orders/admin/orders/?page=${page}`);
  const [orderslist, setOrderslist] = useState([]);
  // setOrderslist(orders.results)

  // useEffect(() => {
  //   if (orders && orders.length > 0) {
  //     let allorders = [];
  //     users.forEach((user) => {
  //       if (user.orders && user.orders.length > 0) {
  //         user.orders.forEach((order) => {
  //           allorders.push({
  //             ...order,
  //             userEmail: user.email,
  //             userName: user.name,
  //             userId: user.id,   
  //             userOrders: user.orders,
  //             status: order.status || "Pending",
  //           });
  //         });
  //       }
  //     });


  // allorders.sort((a, b) => new Date(b.date) - new Date(a.date));

  // setOrderslist(allorders);
  //   }
  // }, [users]);



  // const orderslist = orders?.results || [];

  useEffect(() => {
    if (orders?.results) {
      setOrderslist(orders.results)

    }

  }, [orders])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.patch(`/orders/admin/order/${orderId}/`, {
        status: newStatus,
      });
      setOrderslist((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order updated to ${newStatus}`)

    } catch (error) {
      toast.error("failed to chnage status")

    }
  }


  //  const handleStatusChange = async (order, newStatus) => {
  //   try {
  //     setOrderslist(prev =>
  //       prev.map(o =>
  //         o.date === order.date && o.userEmail === order.userEmail
  //           ? { ...o, status: newStatus }
  //           : o
  //       )
  //     );

  //     const updatedOrders = order.userOrders.map(o =>
  //       o.date === order.date ? { ...o, status: newStatus } : o
  //     );

  //     await axios.patch(`${URL}/users/${order.userId}`, {
  //       orders: updatedOrders,
  //     });

  //     toast.success(`Order marked as ${newStatus}`);
  //   } catch (err) {
  //     toast.error("Failed to update status: " + err.message);
  //   }
  // };


  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute w-full h-full border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-green-800 text-lg font-semibold animate-pulse">
          Please wait, orders are loading...
        </p>
      </div>
    );
  }

  if (error) return <div className="text-red-500 p-10 text-center font-bold">Error loading orders.</div>;
  {
    !loading && !error && orderslist.length === 0 && (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold text-gray-600">
          No Orders Found
        </h2>

      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen border-t-4 border-lime-500">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-black text-sky-950 tracking-tight uppercase">
          PeakPack <span className="text-lime-500">Orders</span>
        </h1>
        <p className="text-gray-500 font-medium">
          Manage customer orders & shipping status
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {orderslist.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition"
          >

            {/* Top Section */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">

              <div>
                <h2 className="text-lg font-bold text-sky-950 uppercase">
                  {order.user.username}
                </h2>
                <p className="text-gray-500 text-sm">
                  {order.user.email}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              {/* Status Dropdown */}
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="px-4 py-2 border-2 border-gray-100 rounded-xl text-sm font-bold focus:border-lime-500 outline-none"
              >
                <option value="PENDING">Pending</option>
                <option value="SHIPPED">Shipped</option>
                <option value="OUT OF DELIVERY">Out For Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Items */}
            <div className="mt-6 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-lg object-cover border border-white shadow-sm"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-sky-950 text-sm uppercase">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="font-black text-sky-950">
                    ₹ {item.order_time_price}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 flex justify-between items-center border-t pt-4">
              <span className="text-sm font-bold uppercase text-gray-400">
                Order Total
              </span>
              <span className="text-xl font-black text-lime-600">
                ₹ {order.total}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="max-w-6xl mx-auto mt-10 flex justify-between items-center">
        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
          Page <span className="text-sky-950 font-black">{page}</span>
        </span>

        <div className="flex gap-2">
          <button
            disabled={!orders?.previous}
            onClick={() => setpage(p => p - 1)}
            className="px-4 py-2 border-2 border-sky-950 text-sky-950 rounded-lg text-xs font-black hover:bg-sky-950 hover:text-white disabled:opacity-30 transition uppercase"
          >
            ← Prev
          </button>

          <button
            disabled={!orders?.next}
            onClick={() => setpage(p => p + 1)}
            className="px-4 py-2 bg-sky-950 border-2 border-sky-950 text-lime-500 rounded-lg text-xs font-black hover:bg-lime-500 hover:text-sky-950 hover:border-lime-500 disabled:opacity-30 transition uppercase"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );

}

export default Orderslayout;

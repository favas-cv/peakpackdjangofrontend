import React, { useEffect, useState } from 'react'
import useFetch from '../../Customhooks/Fetchinghook';
import { useNavigate } from 'react-router-dom';
import {
    PieChart, Pie, Cell,
    LineChart, Line,
    XAxis, YAxis,
    Tooltip, CartesianGrid,
    ResponsiveContainer
} from "recharts";

function Admindashboard() {

    const [page, setpage] = useState(1);

    const { data: products } = useFetch('/products/admin/dashboard/');
    const { data: users } = useFetch('/accounts/userslist/');
    const { data: orders } = useFetch(`/orders/admin/dashboard/?page=${page}`);
    const { data: recentorders, loading, error } = useFetch(`/orders/admin/orders/?page=${page}`);


    const nav = useNavigate();
    const [recentorderslist, setresentorderslist] = useState([])

    const [revenue, setRevenue] = useState(0);
    const [revenueData, setRevenueData] = useState([]);
    const [categorystock, setCategorystock] = useState([]);

    // ✅ Revenue + Line Chart
    useEffect(() => {
        if (orders) {

            // Total Revenue
            setRevenue(orders?.totalrevenue?.t || 0);

            // Format & Sort Revenue Data
            const chartData = orders?.revenuedata
                ?.map(item => ({
                    date: item.created_at.split("T")[0],
                    revenue: item.totalbydate
                }))
                ?.sort((a, b) => new Date(a.date) - new Date(b.date));

            setRevenueData(chartData || []);
        }
    }, [orders]);

    // ✅ Category Pie Chart
    useEffect(() => {
        if (products?.total_products > 0) {
            const chartData = products?.category_data?.map(cat => ({
                category: cat.category__name,
                count: cat.total
            }));

            setCategorystock(chartData || []);
        }
    }, [products]);

    useEffect(() => {
        if (recentorders?.results && recentorders?.results?.length > 0) {

            setresentorderslist(recentorders?.results)
        }

    }, [recentorders])

    return (
        <div className="flex min-h-screen bg-gray-100">
            <main className="flex-1 p-6 space-y-10">

                {/* ====== TOTAL CARDS ====== */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                    <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition">
                        <h2 className="text-xl font-semibold text-gray-700">Total Products</h2>
                        <p className="text-3xl font-bold text-blue-600 mt-2">
                            {products?.total_products || 0}
                        </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition">
                        <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {users?.count || 0}
                        </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition">
                        <h2 className="text-xl font-semibold text-gray-700">Total Revenue</h2>
                        <p className="text-3xl font-bold text-purple-600 mt-2">
                            ₹{revenue.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition">
                        <h2 className="text-xl font-semibold text-gray-700">Orders</h2>
                        <p className="text-3xl font-bold text-orange-600 mt-2">
                            {orders?.totalorder || 0}
                        </p>
                    </div>
                </div>

                {/* ====== CHARTS ====== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Revenue Line Chart */}
                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                            Revenue Over Time
                        </h2>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value}`} />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Category Pie Chart */}
                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                            Product by Category
                        </h2>

                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categorystock}
                                    dataKey="count"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={60}
                                    label
                                >
                                    {categorystock.map((entry, index) => {
                                        let color = "#f97316";

                                        if (entry.category === "trekking") color = "#4ade80";
                                        else if (entry.category === "camping") color = "#dff871";
                                        else if (entry.category === "beach-trips") color = "#0576ff";
                                        else if (entry.category === "gadgets") color = "#ea08c8";

                                        return <Cell key={index} fill={color} />;
                                    })}
                                </Pie>
                                <Tooltip formatter={(value) => `${value} products`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ====== RECENT ORDERS ====== */}
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">
                        Recent Orders
                    </h2>

                    {recentorderslist.length === 0 ? (
                        <p className="text-gray-500 text-sm">No recent orders found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-3 text-sm font-semibold">Order ID</th>
                                        <th className="p-3 text-sm font-semibold">Username</th>
                                        <th className="p-3 text-sm font-semibold">Total</th>
                                        <th className="p-3 text-sm font-semibold">Date</th>
                                        <th className="p-3 text-sm font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentorderslist.slice(0, 5).map(order => (
                                        <tr key={order.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 text-sm">{order.id}</td>
                                            <td className="p-3 text-sm">
                                                {order.user?.username}
                                            </td>
                                            <td className="p-3 text-sm font-semibold text-purple-600">
                                                ₹{order.total}
                                            </td>
                                            <td className="p-3 text-sm">
                                                {new Date(order.created_at)
                                                    .toLocaleDateString("en-IN")}
                                            </td>
                                            <td className="p-3 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                    ${order.status === "DELIVERED"
                                                        ? "bg-green-100 text-green-700"
                                                        : order.status === "PENDING"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>




            </main>
        </div>
    )
}

export default Admindashboard;

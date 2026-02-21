import React, { useState, useEffect, useRef } from "react";
import useFetch from "../../../Customhooks/Fetchinghook";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axiosInstance";
import { FaPencilAlt, FaTrashAlt, FaPlus, FaTimes } from "react-icons/fa";

function Productslayout() {
    const [page, setpage] = useState(1);
    const URL = '/products/admin/product';
    const formRef = useRef(null);

    const { data: CategoryData } = useFetch(`/products/admin/category/`);
    const { data: products, loading, error } = useFetch(`/products/admin/products/?page=${page}`);

    const [productsList, setProductsList] = useState([]);
    const [newproduct, setNewproduct] = useState({
        name: "", description: "", price: "", category: "", season: "SUMMER", image: null
    });
    const [editingproduct, seteditingproduct] = useState(null);
    const [showform, setshowform] = useState(false);

    const [formError, setFormerror] = useState({})

    useEffect(() => {
        if (products?.results) setProductsList(products.results);
    }, [products]);

    const handleChange = (e) => {
        setNewproduct({ ...newproduct, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setNewproduct({ ...newproduct, image: e.target.files[0] });
    };

    const handleEdit = (product) => {
        setFormerror({})
        setNewproduct({
            ...product,
            category: product.category?.id || product.category
        });
        seteditingproduct(product.id);
        setshowform(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", newproduct.name);
            formData.append("description", newproduct.description);
            formData.append("price", Number(newproduct.price));
            formData.append("category_id", Number(newproduct.category));
            formData.append("season", newproduct.season);
            if (newproduct.image) formData.append("image", newproduct.image);

            if (editingproduct) {
                const res = await axiosInstance.patch(`${URL}/${editingproduct}/`, formData);
                setProductsList(prev => prev.map(p => p.id === editingproduct ? res.data : p));
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}:`, value);
                }
                toast.success("Product updated successfully");
                setFormerror({})
            } else {
                const res = await axiosInstance.post('/products/admin/products/', formData);
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}:`, value);
                }
                setProductsList(prev => [res.data, ...prev]);
                toast.success("Product added successfully");
                setFormerror({})
            }
            resetForm();
        } catch (err) {
            if (err.response?.data) {
                setFormerror(err.response.data)
            }
            else if (err.request) {
                toast.error("server issue ,please try later.")
            } else {

                toast.error("something went wrong please try later.");
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axiosInstance.delete(`${URL}/${id}/`);
            setProductsList(prev => prev.filter(p => p.id !== id));
            toast.success("Deleted successfully");
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const resetForm = () => {
        setNewproduct({ name: "", price: "", category: "", season: "SUMMER", image: null, description: "" });
        seteditingproduct(null);
        setshowform(false);
        setFormerror({})
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-lime-600 font-bold tracking-widest">LOADING INVENTORY...</div>;
    if (error) return <div className="text-red-500 p-10 text-center font-bold">Error loading products.</div>;
    {
        !loading && !error && products?.results?.length === 0 && (
            <div className="text-center mt-10">
                <h2 className="text-xl font-semibold text-gray-600">
                    No Products Found
                </h2>

            </div>
        )
    }
    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen border-t-4 border-lime-500">
            {/* Header */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-sky-950 tracking-tight uppercase">PeakPack <span className="text-lime-500">Admin</span></h1>
                    <p className="text-gray-500 font-medium">Manage your premium adventure collection</p>
                </div>
                {!showform && (
                    <button
                        onClick={() => {

                            setshowform(true)
                            setFormerror({})
                        }}
                        className="bg-sky-950 text-white px-6 py-3 rounded-xl font-bold hover:bg-lime-500 hover:text-sky-950 transition-all shadow-xl flex items-center gap-2"
                    >
                        <FaPlus /> Add Product
                    </button>
                )}
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Form Section */}
                {showform && (
                    <div ref={formRef} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-sky-950 uppercase">{editingproduct ? "Edit Product Details" : "Register New Product"}</h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-red-500 flex items-center gap-1 font-bold">
                                <FaTimes /> Close
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                {formError.name && (
                                    <p className="text-red-500 text-xs">
                                        {formError.name[0]}
                                    </p>
                                )}

                                <label className="text-xs font-bold uppercase text-gray-400">Product Name</label>
                                <input type="text" name="name" value={newproduct.name} onChange={handleChange} className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-lime-500 outline-none transition" placeholder="e.g. Alpine Backpack" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-400">Price (USD)</label>
                                <input type="number" name="price" value={newproduct.price} onChange={handleChange} className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-lime-500 outline-none transition" placeholder="0.00" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-400">Category</label>
                                <select name="category" value={newproduct.category} onChange={handleChange} className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-lime-500 outline-none transition" required>
                                    <option value="">Select Category</option>
                                    {CategoryData?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-400">Season</label>
                                <select name="season" value={newproduct.season} onChange={handleChange} className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-lime-500 outline-none transition">
                                    {/* <option value="">Choose a Season</option> */}
                                    <option value="SUMMER">Summer</option>
                                    <option value="WINTER">Winter</option>
                                    <option value="RAINY">Rainy</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-400">Description</label>
                                <textarea name="description" value={newproduct.description} onChange={handleChange} rows="3" className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-lime-500 outline-none transition" placeholder="Tell the story of this product..."></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold uppercase text-gray-400 block mb-2">Product Image</label>
                                <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100 cursor-pointer" />
                            </div>
                            <button type="submit" className="md:col-span-2 bg-sky-950 text-lime-500 py-4 rounded-xl font-bold hover:bg-lime-500 hover:text-sky-950 transition-all shadow-lg">
                                {editingproduct ? "Update Product" : "Launch Product"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-sky-950 border-b border-gray-100">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-white uppercase">Product Details</th>
                                    <th className="p-5 text-xs font-bold text-white uppercase">Category</th>
                                    <th className="p-5 text-xs font-bold text-white uppercase">Price</th>
                                    <th className="p-5 text-xs font-bold text-white uppercase text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {productsList.map((product) => (
                                    <tr key={product.id} className="hover:bg-lime-50/20 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <img src={product.image_url} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm group-hover:scale-105 transition" />
                                                <span className="font-bold text-sky-950 uppercase text-sm">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-5"><span className="px-3 py-1 bg-gray-100 text-sky-900 rounded-full text-[10px] font-black uppercase tracking-wider">{product.category?.name}</span></td>
                                        <td className="p-5 font-black text-sky-950">${product.price}</td>
                                        <td className="p-5">
                                            <div className="flex justify-center gap-4">
                                                <button onClick={() => handleEdit(product)} title="Edit" className="p-2.5 bg-sky-50 text-sky-950 hover:bg-sky-950 hover:text-lime-500 rounded-lg transition-all">
                                                    <FaPencilAlt size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} title="Delete" className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                                                    <FaTrashAlt size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Page <span className="text-sky-950 font-black">{page}</span></span>
                        <div className="flex gap-2">
                            <button
                                disabled={!products?.previous}
                                onClick={() => setpage(p => p - 1)}
                                className="px-4 py-2 border-2 border-sky-950 text-sky-950 rounded-lg text-xs font-black hover:bg-sky-950 hover:text-white disabled:opacity-30 transition uppercase tracking-tighter"
                            >
                                ← Prev
                            </button>
                            <button
                                disabled={!products?.next}
                                onClick={() => setpage(p => p + 1)}
                                className="px-4 py-2 bg-sky-950 border-2 border-sky-950 text-lime-500 rounded-lg text-xs font-black hover:bg-lime-500 hover:text-sky-950 hover:border-lime-500 disabled:opacity-30 transition uppercase tracking-tighter"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Productslayout;
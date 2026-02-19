import React, { useContext, useState, useEffect } from "react";
import { Bagcontext } from "../context/Bagcontext";
import { Usercontext } from "../context/Usercontext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Orderdetailpage() {

  const nav = useNavigate();
  const { user } = useContext(Usercontext);
  const { bagItems, bagTotal, subtotal, charge } = useContext(Bagcontext);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  const [newAddress, setNewAddress] = useState({
    streetAddress: "",
    city: "",
    pincode: "",
    landmark: "",
    phone: ""
  });

  useEffect(() => {
    if (!user) return;

    axiosInstance.get("/address/")
      .then(res => setAddresses(res.data.results))
      .catch(err => console.log(err));

  }, [user]);

   useEffect(() => {
    const savedAddressId = localStorage.getItem("selectedAddressId");
    if (savedAddressId) {
      setSelectedAddress(Number(savedAddressId));
    }
  }, []);


  const handleChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value
    });

    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ""
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!newAddress.streetAddress.trim())
      newErrors.streetAddress = "Street address is required.";

    if (!newAddress.city.trim())
      newErrors.city = "City is required.";

    if (!newAddress.pincode)
      newErrors.pincode = "Pincode is required.";
    else if (!/^\d+$/.test(newAddress.pincode))
      newErrors.pincode = "Pincode must contain only digits.";

    if (!newAddress.landmark.trim())
      newErrors.landmark = "Landmark is required.";

    if (!newAddress.phone)
      newErrors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(newAddress.phone))
      newErrors.phone = "Phone must be 10 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveAddress = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors.");
      return;
    }

    try {
      const res = await axiosInstance.post("/address/", newAddress);
      setAddresses(prev => [...prev, res.data]);

      setNewAddress({
        streetAddress: "",
        city: "",
        pincode: "",
        landmark: "",
        phone: ""
      });

      setErrors({});
      setShowForm(false);
      toast.success("Address saved successfully!");

    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      }
      toast.error("Error saving address.");
    }
  };

  const deleteAddress = async (id) => {
    try {
      await axiosInstance.delete(`/address/${id}/`);
      setAddresses(prev => prev.filter(addr => addr.id !== id));

      if (selectedAddress === id) {
        setSelectedAddress(null);
        localStorage.removeItem('selectedAddressId');
      }

      toast.success("Address deleted successfully!");

    } catch (err) {
      toast.error("Error deleting address.");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 p-4">
        <p className="text-xl text-gray-700 font-medium mb-4">
          You must be logged in to place an order.
        </p>
        <button
          className="bg-teal-500 text-white px-8 py-3 rounded-lg"
          onClick={() => nav("/loginpage")}
        >
          Login Now
        </button>
      </div>
    );
  }

  if (bagItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-white p-4">
        <h2 className="text-3xl font-bold text-gray-700 mb-3">
          Can't Checkout: Bag is Empty!
        </h2>
        <button
          onClick={() => nav("/")}
          className="mt-6 bg-teal-500 text-white px-8 py-3 rounded-lg"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800">
        Checkout Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="md:col-span-2 space-y-8">

          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h2 className="text-2xl font-bold mb-5 border-b pb-3">
              1. Select Delivery Address
            </h2>

            {addresses.map(addr => (
              <div
                key={addr.id}
                onClick={() => {
                  setSelectedAddress(addr.id);
                  localStorage.setItem('selectedAddressId', addr.id)

                }}

                className={`border-2 rounded-xl p-4 mb-4 cursor-pointer transition
                ${selectedAddress === addr.id
                    ? "border-sky-950 bg-sky-50"
                    : "border-gray-200 hover:shadow-sm"}`}
              >
                <p className="font-bold text-lg">{addr.streetAddress}</p>
                <p>{addr.city} - {addr.pincode}</p>
                <p className="text-sm text-gray-500">{addr.landmark}</p>
                <p className="mt-1 font-medium">📞 {addr.phone}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAddress(addr.id);
                  }}
                  className="text-red-500 text-sm mt-2"
                >
                  Delete
                </button>
              </div>
            ))}

            {/* ADD NEW ADDRESS */}
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-gray-100 px-4 py-2 rounded-lg border-dashed border-2 border-gray-300 w-full"
              >
                Add New Address
              </button>
            )}

            {showForm && (
              <div className="space-y-4 mt-6 p-4 border rounded-xl bg-gray-50">

                {["streetAddress", "city", "pincode", "landmark", "phone"].map(field => (
                  <div key={field}>
                    <input
                      type="text"
                      name={field}
                      placeholder={field}
                      value={newAddress[field]}
                      onChange={handleChange}
                      className={`w-full border px-4 py-2 rounded-lg
                      ${errors[field] ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors[field] &&
                      <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                  </div>
                ))}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={saveAddress}
                    className="flex-1 bg-teal-500 text-white py-2 rounded-lg"
                  >
                    Save Address
                  </button>

                  <button
                    onClick={() => {
                      setShowForm(false);
                      setErrors({});
                    }}
                    className="flex-1 bg-gray-300 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* ORDER ITEMS */}
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h2 className="text-2xl font-bold mb-5 border-b pb-3">
              2. Order Items ({bagItems.length})
            </h2>

            {bagItems.map(item => {
              const itemSubtotal = item.product.price * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4 border-b last:border-none"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 object-contain border rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        ₹ {item.product.price} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="font-bold">
                    ₹ {itemSubtotal}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow-lg border h-fit sticky top-4">
          <h2 className="text-2xl font-bold mb-4 border-b pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 mb-4">
            <p className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹ {Math.round(bagTotal)}</span>
            </p>

            <p className="flex justify-between">
              <span>Delivery:</span>
              <span>₹ {charge}</span>
            </p>

            <hr />

            <p className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹ {Math.round(subtotal)}</span>
            </p>
          </div>

          <button
            disabled={!selectedAddress}
            onClick={() => nav("/checkout")}
            className={`w-full py-3 rounded-lg text-white font-bold
            ${selectedAddress
                ? "bg-lime-500 hover:bg-sky-950"
                : "bg-gray-400 cursor-not-allowed"}`}
          >
            Proceed to Payment
          </button>

        </div>

      </div>

    </div>
  );
}

export default Orderdetailpage;

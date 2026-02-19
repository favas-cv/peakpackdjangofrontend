import React, { useContext, useState, useEffect } from "react";
import { Bagcontext } from "../context/Bagcontext";
import { Usercontext } from "../context/Usercontext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Checkoutpage() {

  const nav = useNavigate();
  const { user } = useContext(Usercontext);
  const { bagItems, subtotal, charge, clearBag } = useContext(Bagcontext);

  const [tickedAddress, setTickedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {

    if (!user) return;

    const selectedId = localStorage.getItem("selectedAddressId");
    if (!selectedId) return;

    axiosInstance.get(`/address/${selectedId}/`)
      .then(res => {
        setTickedAddress(res.data);
      })
      .catch(err => console.log(err));

  }, [user]);



  //place order 
  const placeOrder = async () => {

    if (!tickedAddress) {
      toast.error("Please select address.");
      return;
    }

    if (bagItems.length === 0) {
      toast.error("Your bag is empty.");
      return;
    }

    if (paymentMethod === 'COD') {

      try {

        await axiosInstance.post("/orders/create/", {
          address_id: tickedAddress.id,
          paymentmethod: paymentMethod
        });

        clearBag();
        localStorage.removeItem("selectedAddressId");

        toast.success("Order placed successfully!  by COD");
        nav("/orderconfirmation");

      } catch (err) {
        console.log(err.response?.data);
        toast.error("Order failed! COD");
      }
    } else if (paymentMethod === 'ONLINE') {

      try {

        const RazorpayRes = await axiosInstance.post('/payment/create-razorpay-order/',
          {
            address_id: tickedAddress.id
          }
        );

        const { order_id, key, amount } = RazorpayRes.data;  //backend response is taking
        //backend createrazorpay apiviw response ^

        const options = {
          key: key,
          amount: amount,
          currency: 'INR',
          name: "PEAKPACK LTD",
          order_id: order_id,
          handler: async function (response) { //this is only works after payment success 
            await axiosInstance.post('payment/verify-payment/', {

              razorpay_payment_id: response.razorpay_payment_id, //this are coming from razorpay server
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              address_id: tickedAddress.id

            });
            clearBag();
            localStorage.removeItem('selectedAddressId')
            toast.success("payment Succesffull and Order Was created");
            nav("/orderconfirmation");
          },
          theme:{
            color:"#84cc16"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();



      } catch (err) {
        console.log(err.response.data)
        toast.error("payment failed")

      }
    }
  }


//no user
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 p-4">
        <button
          className="bg-teal-500 text-white py-3 px-8 rounded-lg"
          onClick={() => nav("/loginpage")}
        >
          Login Now
        </button>
      </div>
    );
  }


//emptbag
  if (bagItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-white p-4">
        <button
          onClick={() => nav('/')}
          className="bg-teal-500 text-white py-3 px-8 rounded-lg"
        >
          Start Shopping
        </button>
      </div>
    );
  }



  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800 text-center lg:text-left">
        Final Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="space-y-8">

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">

            <h2 className="text-2xl font-bold mb-5 border-b pb-3">
              Order Items ({bagItems.length})
            </h2>

            {bagItems.map(item => {

              const itemTotal = item.product.price * item.quantity;

              return (
                <div key={item.id}
                  className="flex items-center justify-between py-3 border-b last:border-b-0">

                  <div className="flex items-center gap-4">

                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-contain border"
                    />

                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold">
                    ₹ {itemTotal}
                  </p>

                </div>
              );
            })}

          </div>


          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">

            <h2 className="text-2xl font-bold mb-4 border-b pb-3">
              Order Summary
            </h2>

            <div className="space-y-3">

              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>₹ {(subtotal - charge)}</span>
              </p>

              <p className="flex justify-between">
                <span>Delivery</span>
                <span>₹ {charge}</span>
              </p>

              <hr />

              <p className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>₹ {subtotal}</span>
              </p>

            </div>
          </div>

        </div>



        <div className="space-y-8">

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">

            <h2 className="text-2xl font-bold mb-5 border-b pb-3">
              Delivery Address
            </h2>

            {tickedAddress ? (
              <div className="border-2 border-sky-950 bg-sky-50 p-4 rounded-xl">

                <p className="font-bold">{tickedAddress.streetAddress}</p>
                <p>{tickedAddress.city} - {tickedAddress.pincode}</p>
                <p>{tickedAddress.landmark}</p>
                <p>📞 {tickedAddress.phone}</p>

              </div>
            ) : (
              <div className="bg-red-50 border p-4 rounded-xl text-red-600">
                No address selected.
                <button
                  onClick={() => nav("/orderdetailpage")}
                  className="ml-3 underline"
                >
                  Select Address
                </button>
              </div>
            )}

          </div>



          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">

            <h2 className="text-2xl font-bold mb-5 border-b pb-3">
              Payment Method
            </h2>

            <select
              className="w-full border py-3 px-4 rounded-lg"
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
            >
              <option value="COD">Cash On Delivery</option>
              <option value="ONLINE">Online Payment</option>
            </select>

          </div>



          <button
            onClick={placeOrder}
            disabled={!tickedAddress}
            className={`w-full py-4 rounded-lg text-white font-bold text-lg
              ${!tickedAddress
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-lime-500 hover:bg-sky-950"
              }`}
          >
            Place Order Now
          </button>

        </div>

      </div>
    </div>
  );
}

export default Checkoutpage;

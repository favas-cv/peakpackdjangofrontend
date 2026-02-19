import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Usercontext } from './Usercontext';
import axiosInstance from '../api/axiosInstance';


export const Bagcontext = createContext();

export function Bagprovider({ children }) {
  const { user } = useContext(Usercontext);

  const userid = user ? user.id : null;
  const URL = userid ? `/cart/bag/` : null;
  const [bagItems, setBagitems] = useState([]);
  const [loading, setloading] = useState(true);





  // showing bag

  useEffect(() => {
    if (!userid) return;
    setloading(true);
    axiosInstance.get(URL)
      .then(res => setBagitems(res.data || []))
      .catch(err => console.log(err))
      .finally(() => setloading(false));
  }, [userid]);

  // adding to bag

  const addtoBag = async (item) => {

    if (!userid) {
      return toast.error("please login ")
    }
    try {

      const res = await axiosInstance.post(URL, {
        product_id: item.id
      });

      if (res.data.msg==='The item is already in bag'){

        toast.info(res.data.msg)
        return;
      }

      const updated = await axiosInstance.get(URL);
      setBagitems(updated.data);


      toast.success(`${item.name} added to bag!`, {
        toastId: `bag-${item.id}`
      });


    } catch (err) {
      toast.error("Error in adding: " + err);
    }
  };

  //removing from bag

  const removefromBag = async (item) => {
    try {

      await axiosInstance.delete(URL,{ data:
        {product_id:item.product.id}
      });

      const res = await axiosInstance.get(URL);
      setBagitems(res.data);

      toast.success(`${item.product.name} is removed from bag`, { toastId: `remove-${item.id}` });

    } catch (err) {
      toast.error("Error in removing: " + err);
    }
  };

  //increase quantity

  const increaseQuantity = async (id) => {
    try {
      await axiosInstance.post(`${URL}increase/${id}/`)
      const res = await axiosInstance.get(URL);
      setBagitems(res.data)
  
    } catch (err) {
      console.log(err.respone)
      toast.error("Error in increment: " + err);
    }
  };

  // decrease quantity


  const decreaseQuantity = async (id) => {
    try {
      await axiosInstance.post(`${URL}decrease/${id}/`);
      const res = await axiosInstance.get(URL);
      setBagitems(res.data);

    } catch (err) {
      toast.error("Error in decrement: " + err);
    }
  };

  // clearing the bag

  const clearBag = async () => {
    await axios.patch(URL, { bag: [] });
    setBagitems([]);
  };

  // bag count

  const bagCount = bagItems.reduce((total, item) => total + item.quantity, 0);

  // total price

const bagTotal = bagItems.reduce(
  (total, item) => total + item.product.price * item.quantity,
  0
);


  //delivery charge

  const charge = bagTotal >= 500 ? 0 : 40;

  //subtotal prioce

  const subtotal = charge + Math.round(bagTotal);


  return (
    <Bagcontext.Provider
      value={{
        bagItems,
        bagCount,
        addtoBag,
        removefromBag,
        decreaseQuantity,
        increaseQuantity,
        clearBag,
        bagTotal,
        subtotal,
        charge,
        URL,
        loading

      }}
    >
      {children}
    </Bagcontext.Provider>
  );
}

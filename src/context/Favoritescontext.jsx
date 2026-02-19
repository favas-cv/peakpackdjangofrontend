import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Usercontext } from './Usercontext';
import axiosInstance from '../api/axiosInstance';
export const Favoritescontext = createContext();

export function Favoritesprovider({ children }) {
  const { user } = useContext(Usercontext);

  const userid = user ? user.id : null;
  const URL = `/cart/favorites/`;
  const [favItems, setFavitems] = useState([]);
  const [loading, setloading] = useState(true);

  // loading favorites

  useEffect(() => {
    if (!userid) return;
    setloading(true);
    axiosInstance.get(URL)
      .then(res => setFavitems(res.data))
      .catch(err => console.error('Error loading favorites', err))
      .finally(() => setloading(false));
  }, [userid]);


  //adding to favorites


  const addtoFav = async (item) => {
    if (!user) {
      return toast.error("please login ")
    }
    try {
      await axiosInstance.post(URL, {
        product_id: item.id
      });
      const res = await axiosInstance.get(URL);
      setFavitems(res.data)
      toast.success("added suceesfully")



      // const { data: user } = await axiosInstance.get(URL);
      // const exist = (user.favorites || []).find(i => i.id === item.id);
      // if (!exist) {
      //   const updatedFavorites = [...(user.favorites || []), item];
      //   await axiosInstance.patch(URL, { favorites: updatedFavorites });
      //   setFavitems(updatedFavorites);
      //  toast.success("Added to favorites!", { toastId: `fav-${item.id}` });

      // }else{
      //   toast.info('Already inside favorites');
      // } }
    }
    catch (err) {
      toast.error("Error adding to favorites: " + err.message);
    }

  }


  //toggle switch

  const toggleFav = async (item) => {
    if (!userid) {
      return toast.error("please login");
    }

    try {
      const exist = favItems.find(f => f.product.id === item.id);

      if (exist) {
        await axiosInstance.delete(`/cart/favorites/${item.id}/`);
        toast.info("Removed from favorites");
      } else {
        await axiosInstance.post(URL, {
          product_id: item.id
        });
        toast.success("Added to favorites");
      }

      const res = await axiosInstance.get(URL);
      setFavitems(res.data);

    } catch (err) {
      console.error(err.response?.data);
      toast.error("Error in toggleFav");
    }
  };




  //removing from favorites


  const removefromFav = async (productId) => {
    try {
      await axiosInstance.delete(`/cart/favorites/${productId}/`);
      setFavitems(prev => prev.filter(item => item.product.id !== productId));
      toast.success("removed successfully")
    } catch (err) {

      console.log(err.response);
      console.log(err.response?.data);


      toast.error("Error removing favorite");
    }
  };



  //clearing from favorites

  const clearFav = async () => {
    if (!userid) return;
    try {
      const res = await axiosInstance.delete(URL)
      setFavitems([])
      toast.success(res.data.msg)
    } catch (err) {
      console.error("Error clearing favorites:", err);
    }
  };

  const favCount = favItems.length;

  return (
    <Favoritescontext.Provider
      value={{ favItems, setFavitems, addtoFav, removefromFav, toggleFav,clearFav, loading, favCount }}>
      {children}
    </Favoritescontext.Provider>
  );
}

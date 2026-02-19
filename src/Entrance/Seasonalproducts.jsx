import React, { useContext } from 'react';
import useFetch from '../Customhooks/Fetchinghook';
import { Bagcontext } from '../context/Bagcontext';
import { Favoritescontext } from '../context/Favoritescontext';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const getAutoseason = ()=>{
  const month = new Date().getMonth()+1;

  if(month >=10 || month <=2){
    return 'winter'
  }else if (month >=3 && month <=5){
    return 'summer'
  }else{
    return 'rainy'
  }
};



function Topsellingproducts() {
const currentseason = getAutoseason()

  const { data: products, loading, error } = useFetch(`/products?season=${currentseason}`); // Limiting for horizontal display
  const { addtoBag } = useContext(Bagcontext);
  const { favItems, toggleFav } = useContext(Favoritescontext);
  const nav = useNavigate();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-lime-500"></div>
        <p className="text-sky-950 text-lg font-semibold animate-pulse mt-4">
          Gathering the best for your next adventure...
        </p>
      </div>
    );
  }

  if (error) return <p className="text-center mt-10 text-red-500">Error loading products. Please try again later.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="flex justify-center">
        <h2 className="text-3xl text-sky-950 font-bold mb-6">Seasonal Products !</h2>
      </div>
  
      
      <div className="relative">
        <div 
          className="flex overflow-x-scroll no-scrollbar py-4 -mx-4 px-4 gap-6" // Hides scrollbar
        >
          {products.results.map((product) => (
            <div
              key={product.id}
              onClick={() => nav(`/shop/${product.id}`)}
              className="relative flex-shrink-0 w-60 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer border border-gray-100"
            >
              <button
                className="absolute top-3 right-3 z-10 p-1 bg-white rounded-full shadow-md hover:shadow-lg transition"
                aria-label="Add to wishlist"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFav(product);
                }}
              >
                {favItems.some(f => f.product.id === product.id) ? (
                  <AiFillHeart className="text-red-500 text-xl" />
                ) : (
                  <AiOutlineHeart className="text-sky-950 text-xl" />
                )}
              </button>

              <div className="overflow-hidden rounded-t-xl">
                <img
                  src={product?.image_url}
                  alt={product.name}
                  className="w-full h-44 object-cover transform hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-4 text-left">
                <h3 className="font-semibold text-base truncate text-sky-950 mb-1">{product.name}</h3>
                <p className="text-gray-500 text-xs font-light">
                  {product.category?.name} | {product.season}
                </p>
                <p className="mt-3 font-extrabold text-xl text-sky-950">${product.price}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addtoBag(product);
                  }}
                  className="mt-4 w-full bg-lime-500 text-sky-950 text-base font-bold py-2.5 rounded-lg hover:bg-lime-600 transition shadow-md"
                >
                  Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Topsellingproducts;
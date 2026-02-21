import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Bagcontext } from '../context/Bagcontext';
import { Favoritescontext } from '../context/Favoritescontext';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaHeart } from 'react-icons/fa'; // Import icons for better button design
import axiosInstance from '../api/axiosInstance';



function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const { addtoBag } = useContext(Bagcontext);
  const { addtoFav } = useContext(Favoritescontext);

//normal axios for public bcz it will not effect instacne errors and likes 
//no authorization header ,so return 200 suddenly like as guest 

  useEffect(() => {
    axios.get(`https://peakpack.ddns.net/products/${id}/`)
      .then(res => setProduct(res.data))
      .catch(err => {
        console.error("Error fetching product details:", err);
        toast.error("Failed to load product details.");
      });
  }, [id]);

  if (!product) return (
    <div className='flex justify-center items-center h-64'>
      <p className='text-xl text-sky-950 font-semibold'>
        Sorry, No Product Found or Loading...
      </p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-8">

          <div className="lg:w-1/2">
            <img 
              src={product.image_url || 'placeholder-image-url.jpg'} 
              alt={product.name} 
              className="w-full h-80 object-cover rounded-xl shadow-lg border border-gray-200" 
            />
          </div>

          <div className="lg:w-1/2 flex flex-col">
            <h1 className="text-4xl font-extrabold text-sky-950 mb-2">{product.name}</h1>
            
            <p className="text-gray-600 text-lg mb-4">
              Category: <span className="font-semibold text-lime-700">{product.category?.name}</span> 
              {" "} | {" "} 
              Season: <span className="font-semibold">{product.season}</span>
            </p>

            <p className="text-4xl font-bold text-sky-950 mb-6 border-b pb-4">
              ${product.price ? product.price : 'N/A'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => addtoBag(product)}
                className="flex items-center justify-center gap-2 flex-1 bg-sky-950 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-sky-800 transition duration-300"
              >
                <FaShoppingCart /> Add to Bag
              </button>
              <button
                onClick={() => addtoFav(product)}
                className="flex items-center justify-center gap-2 flex-1 bg-lime-500 text-sky-950 font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-lime-600 transition duration-300"
              >
                <FaHeart /> Add to Wishlist
              </button>
            </div>
            
            <div className="mt-auto pt-6 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-sky-950 mb-3">Product Description</h2>
                <div className="p-4 bg-lime-50 rounded-lg border border-lime-100 shadow-inner">
                    <p className="text-gray-700 leading-relaxed">
                        {product.description || 
                            "This is a placeholder for the detailed product description. Once you update your database, this field will automatically display the unique selling points, material details, sizing information, and care instructions for the product."
                        }
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
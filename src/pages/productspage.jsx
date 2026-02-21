import React, { useContext, useEffect, useState } from 'react';
import Filteringnavbar from '../components/Filteringnavbar';
import axiosInstance from '../api/axiosInstance';
import { Bagcontext } from '../context/Bagcontext';
import { Favoritescontext } from '../context/Favoritescontext';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import axios from 'axios';

function Productspage() {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  // State for the text currently being typed
  const [searchInput, setSearchInput] = useState('');
  // State for the text actually submitted for filtering
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [sortOption, setSortOption] = useState('None');

  const { addtoBag } = useContext(Bagcontext);
  const { favItems, toggleFav } = useContext(Favoritescontext);
  const nav = useNavigate();

  useEffect(()=>{
    setPage(1)

  },[selectedCategory,selectedSeason,sortOption])

  useEffect(() => {
    let query = `?page=${page}`;

    if (selectedCategory !== "All") {
      query += `&category=${selectedCategory}`;
    }

    if (selectedSeason !== "All") {
      query += `&season=${selectedSeason}`;
    }

    // Use searchTerm here (the one set on submit)
    if (searchTerm.trim() !== "") {
      query += `&search=${searchTerm}`;
    }

    if (sortOption === "price-low-high") {
      query += `&ordering=price`;
    } else if (sortOption === "price-high-low") {
      query += `&ordering=-price`;
    } else if (sortOption === "name-a-z") {
      query += `&ordering=name`;
    } else if (sortOption === "name-z-a") {
      query += `&ordering=-name`;
    }

    setLoading(true);
    axios.get(`https://peakpack.ddns.net/products/${query}`)
      .then(res => {
        setProducts(res.data);
        setError(null);
      })
      .catch(err => {
        if (err.response) {
          // setError(err.response.data.detail)
          setError('Network error.check your internet.')
        } else if (err.request) {
          setError("Server error.please try again later.")
          // setError(err.request)
        } else {
          setError("Something went wrong please try again later ")
        }
        // console.log("products error", err.response);
        // setError(err);
      })
      .finally(() => setLoading(false));

  }, [page, selectedCategory, selectedSeason, searchTerm, sortOption]);

  const handleSearchSubmit = () => {
    setPage(1); // Reset to first page on new search
    setSearchTerm(searchInput);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <Filteringnavbar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {error && (
        <div className="text-center text-red-600 font-semibold mt-6">
          {error}
        </div>
      )}

      {!loading && !error && products?.results?.length === 0 && (
        <div className="text-center mt-10">
          <h2 className="text-xl font-semibold text-gray-600">
            No Products Found
          </h2>
          <p className="text-gray-500 mt-2">
            Try changing filters or search term.
          </p>
        </div>
      )}



      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-6">
        {products?.results?.map((product) => (
          <div
            key={product.id}
            className="relative bg-white rounded-xl shadow-lg p-3 cursor-pointer"
            onClick={() => nav(`/shop/${product.id}`)}
          >
            <button
              className="absolute top-3 right-3"
              onClick={(e) => {
                e.stopPropagation();
                toggleFav(product);
              }}
            >
              {favItems.find(f => f.product.id === product.id) ?
                <AiFillHeart className="text-red-500 text-xl" /> :
                <AiOutlineHeart className="text-sky-950 text-xl" />
              }
            </button>

            <img
              src={product?.image_url}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />

            <h3 className="font-semibold mt-2">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category?.name} | {product.season}</p>
            <p className="font-bold">${product.price}</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addtoBag(product);
              }}
              className="mt-2 w-full bg-lime-500 py-2 rounded font-medium hover:bg-lime-600 transition"
            >
              Add to Bag
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-8 pb-10">
        <button
          disabled={!products?.previous}
          onClick={() => setPage(prev => prev - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={!products?.next}
          onClick={() => setPage(prev => prev + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Productspage;
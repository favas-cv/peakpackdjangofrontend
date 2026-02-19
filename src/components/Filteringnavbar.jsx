import React, { useState } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function FilteringNavbar({
  searchInput,
  setSearchInput,
  onSearchSubmit,
  selectedCategory,
  setSelectedCategory,
  selectedSeason,
  setSelectedSeason,
  sortOption,
  setSortOption,
}) {
  const [filterOpen, setFilterOpen] = useState(false);

  const dropdownClass =
    "appearance-none w-full px-5 py-2.5 rounded-full bg-white text-gray-700 font-medium outline-none cursor-pointer border border-gray-200 relative pr-10 focus:border-blue-400 transition-all";

  // FIX: This clears the input AND tells the parent to reset the product list
  const handleClear = () => {
    setSearchInput(""); 
    // We pass "" directly to bypass the state delay
    onSearchSubmit(""); 
  };

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center bg-white rounded-xl px-4 py-3 relative shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit(searchInput);
          }}
          className="flex items-center w-full md:w-1/2 bg-gray-100 rounded-full px-4 py-2"
        >
          <FiSearch
            className="text-gray-500 mr-2 cursor-pointer hover:text-blue-600 transition"
            size={20}
            onClick={() => onSearchSubmit(searchInput)}
          />

          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
          />

          {/* X Button - Clears and Resets */}
          {searchInput && (
            <button 
              type="button" 
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 transition ml-2"
            >
              <FiX size={18} />
            </button>
          )}
        </form>

        {/* ... Rest of your Navbar code (Filter buttons, Dropdowns) remains the same ... */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="md:hidden ml-3 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition"
        >
          {filterOpen ? <FiX size={22} /> : <FiFilter size={22} />}
        </button>

        <div className="hidden md:flex gap-3 items-center">
          <div className="relative">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={dropdownClass}>
              <option value="All">🌍 All Categories</option>
              <option value="trekking">🥾 Trekking</option>
              <option value="camping">🏕️ Camping</option>
              {/* <option value="Rainy">🌧️ Rainy</option> */}
              <option value="gadgets">⚙️ Gadgets</option>
              <option value="beach-trips">🏖️ Beach Trips</option>
            </select>
          </div>
          <div className="relative">
            <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)} className={dropdownClass}>
              <option value="All">🗓️ All Seasons</option>
              <option value="SUMMER">☀️ Summer</option>
              <option value="WINTER">❄️ Winter</option>
              <option value="RAINY">🌧️ Rainy</option>
            </select>
          </div>
          <div className="relative">
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className={dropdownClass}>
              <option value="None">📊 Sort By</option>
              <option value="price-low-high">💰 Price: Low → High</option>
              <option value="price-high-low">💸 Price: High → Low</option>
              <option value="name-a-z">🔤 Name: A → Z</option>
              <option value="name-z-a">🔠 Name: Z → A</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilteringNavbar;
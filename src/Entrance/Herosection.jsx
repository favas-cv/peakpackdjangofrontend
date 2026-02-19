import React from "react";
import { useNavigate } from "react-router-dom";
import Activitybar from "./Activitybar";
import Topsellingproducts from "./Seasonalproducts";
import Dealoftheday from "./Dealoftheday";
import Featuredcategories from "./Featuredcategories";
import Navbar from "./Navbar";
import WeatherSuggestionCard from "./weatherbar";

function Hero() {
  const nav = useNavigate();
  return (
    <>

      <div
        className="min-h-screen"
        style={{
          backgroundImage: "url('/images/shadowbg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#c1e3b9ff' // Fallback color
        }}

      >


        <div className="relative w-full h-[90vh] min-h-[600px] bg-gray-500">

          <img
            src="/images/nighthero.jpg"
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover object-bottom"
          />
          <div className="hidden lg:block absolute top-8 right-10 z-20">
            <WeatherSuggestionCard />
          </div>


          <div className="absolute inset-0 bg-black/30"></div>

          <div className="relative z-10 flex flex-col items-start justify-center h-full px-10 md:px-20 text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 mt-20">
              <span>PACK</span><br />
              <span>FOR THE PEAKS</span>
            </h1>
            <p className="text-lg md:text-xl max-w-xl mb-6">
              A one-stop platform for all your adventure and travel essentials.
            </p>
            <button
              onClick={() => nav('/shop')}
              className="relative px-6 py-3 rounded-lg font-semibold text-gray-800 
      bg-white border border-gray-200 overflow-hidden group shadow-lg"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-lime-500 to-transparent 
        -translate-x-full group-hover:translate-x-full 
        transition-transform duration-700 ease-in-out"></span>

              <span className="relative z-10">Shop Now →</span>
            </button>
            <br />
            <Activitybar />
          </div>
        </div>

        <div className="relative z-10">
          <Featuredcategories />
          <Topsellingproducts />
          <br />


          <Dealoftheday />

        </div>
      </div>


    </>
  );
}

export default Hero;

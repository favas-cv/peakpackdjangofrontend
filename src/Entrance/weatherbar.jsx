import React, { useEffect, useState } from "react";
import axios from "axios";
import { RainEffect, SnowEffect, SunEffect } from "./weathereffects"

function WeatherSuggestionCard() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/external/weather/")
      .then(res => setWeather(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!weather) return null;

  const temp = weather?.temp||0;
  const condition = weather?.condition?.toLowerCase()||"";

  const isRain = condition.includes("rain");
  const isSnow = temp < 15;
  const isHot = temp > 30;

  let bgStyle = "bg-white/20";
  let glow = "";

  if (isHot) {
    bgStyle = "bg-orange-400/30";
    glow = "shadow-orange-500/50 shadow-2xl";
  }

  if (isSnow) {
    bgStyle = "bg-blue-400/30";
    glow = "shadow-blue-500/50 shadow-2xl";
  }

  if (isRain) {
    bgStyle = "bg-gray-700/40";
    glow = "shadow-gray-500/50 shadow-2xl";
  }

  return (
    <div className="relative w-80 overflow-hidden rounded-2xl">

      {/* Weather Animations */}
      {isRain && <RainEffect />}
      {isSnow && <SnowEffect />}
      {isHot && <SunEffect />}

      <div
        className={`relative z-10 backdrop-blur-md text-white 
        p-5 transition-all duration-500 
        ${bgStyle} ${glow}`}
      >
        <h2 className="text-lg font-semibold">
          📍 {weather?.location?.name}, {weather?.location?.region}
        </h2>

        <div className="flex items-center justify-between mt-2">
          <p className="text-4xl font-bold">{temp}°C</p>
          <span className="text-3xl">
            {isHot && "☀️"}
            {isSnow && "❄️"}
            {isRain && "🌧"}
          </span>
        </div>

        <p className="mt-2 text-sm opacity-90">
          {weather?.condition}
        </p>

        <div className="border-t border-white/30 pt-3 mt-3">
          ✈ {weather?.suggestion}
        </div>
      </div>
    </div>
  );
}

export default WeatherSuggestionCard;

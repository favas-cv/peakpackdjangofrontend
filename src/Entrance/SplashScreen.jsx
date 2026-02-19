// src/components/SplashScreen.jsx
import React from "react";
import { motion } from "framer-motion";

function SplashScreen() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white z-[9999]">
      {/* Logo animation */}
      <motion.img
        src="/images/peakicon.png"
        alt="App Logo"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-28 w-auto mb-4"
      />
      {/* Text fade-in */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-3xl font-bold text-sky-950"
      >
        Peak<span className="text-lime-500">Pack</span>
      </motion.h1>
    </div>
  );
}

export default SplashScreen;
 
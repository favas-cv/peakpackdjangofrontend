import { motion } from "framer-motion";

// 🌧 Rain Effect
export function RainEffect() {
  const drops = Array.from({ length: 60 });

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {drops.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-6 bg-white/60"
          initial={{ 
            y: -20, 
            x: Math.random() * 320 
          }}
          animate={{ y: 500 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: Math.random(),
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

// ❄ Snow Effect
export function SnowEffect() {
  const flakes = Array.from({ length: 40 });

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {flakes.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-80"
          initial={{
            y: -10,
            x: Math.random() * 320,
          }}
          animate={{
            y: 500,
            x: Math.random() * 320
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

// ☀ Sun Effect
export function SunEffect() {
  return (
    <div className="absolute top-4 right-4 z-0 pointer-events-none">
      <motion.div
        className="w-16 h-16 rounded-full bg-yellow-400 shadow-[0_0_50px_rgba(255,200,0,0.8)]"
        animate={{ rotate: 360 }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

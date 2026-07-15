import { useState, useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import { Wifi, Radio, Cpu, Sparkles, Activity } from "lucide-react";
import globeImage from "@/assets/images/network_globe_hub_1783928987319.jpg";
interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function InteractiveHeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [rippleId, setRippleId] = useState(0);

  // Motion values for mouse coordinate tracking relative to card center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs to avoid jittery rotation transitions
  const springConfig = { damping: 20, stiffness: 120, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  // Sub-layer translations for immersive parallax depth
  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);

  // Highlight/glow positions
  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Normalize coordinates to [-0.5, 0.5] range relative to the card center
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset tilt and translation to original center
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      id: rippleId,
      x,
      y
    };

    setRipples((prev) => [...prev, newRipple]);
    setRippleId((prev) => prev + 1);

    // Prune old ripples
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1000);
  };

  return (
    <div 
      className="w-full flex items-center justify-center p-4 lg:p-0"
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="relative w-full max-w-[420px] aspect-square rounded-[32px] border border-blue-500/20 bg-blue-950/20 backdrop-blur-xl overflow-hidden cursor-pointer shadow-2xl shadow-cyan-500/5 group"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Dynamic Glowing Spotlight following cursor */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(400px circle at ${glowX} ${glowY}, rgba(34, 211, 238, 0.15), transparent 70%)`
          }}
        />

        {/* Core Image Asset */}
       <div className="absolute inset-0 select-none p-1.5 overflow-hidden rounded-[32px]">
  <img
    src={globeImage}
    alt="CoreConnect Interactive Globe"
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover rounded-[26px] opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out border border-white/5"
  />
</div>

        {/* Grid and circuit lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none rounded-[32px]" />

        {/* Ambient pulse rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[85%] h-[85%] rounded-full border border-cyan-500/10 animate-[ping_3s_infinite] opacity-30" />
          <div className="w-[60%] h-[60%] rounded-full border border-primary/10 animate-[ping_4s_infinite] opacity-25" />
        </div>

        {/* --- FLOATING CAPABILITIES & STATUSES WITH IMMERSIVE PARALLAX DEPTH --- */}

        {/* Top-Left: Active Live Speed Node */}
        <motion.div 
          className="absolute top-6 left-6 z-20 flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-blue-950/70 backdrop-blur-md px-3.5 py-2 shadow-lg"
          style={{
            x: parallaxX,
            y: parallaxY,
            translateZ: 40
          }}
        >
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </div>
          <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-300">
            FIBER: 1000 MBPS
          </span>
        </motion.div>

        {/* Top-Right: Symmetrical Link Health */}
        <motion.div 
          className="absolute top-6 right-6 z-20 flex items-center gap-2 rounded-xl border border-white/10 bg-blue-950/70 backdrop-blur-md px-3.5 py-2 shadow-lg"
          style={{
            x: useTransform(parallaxX, (v) => -v * 0.8),
            y: useTransform(parallaxY, (v) => -v * 0.8),
            translateZ: 30
          }}
        >
          <Activity className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
          <span className="text-[11px] font-mono text-indigo-200">
            PING: 2MS
          </span>
        </motion.div>

        {/* Bottom-Left: 5G Wireless Plus card */}
        <motion.div 
          className="absolute bottom-6 left-6 right-6 z-20 rounded-2xl border border-white/10 bg-[#061432]/80 backdrop-blur-md p-3.5 shadow-xl transition-all duration-300 group-hover:border-cyan-500/30"
          style={{
            x: useTransform(parallaxX, (v) => v * 0.5),
            y: useTransform(parallaxY, (v) => v * 0.5),
            translateZ: 50
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              CoreConnect Networks Hub
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
              ACTIVE
            </span>
          </div>
        </motion.div>

        {/* Click Signal Ripples */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute bg-cyan-400/40 rounded-full pointer-events-none z-30"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 2,
                height: 2,
                transform: "translate(-50%, -50%)"
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 120, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

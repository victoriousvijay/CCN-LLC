import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export default function Interactive3DCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [hoverType, setHoverType] = useState<string | null>(null);

  // High performance mouse tracking using Framer Motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for trailing/delayed effect
  const springConfig = { damping: 25, stiffness: 220, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Inner dot is faster/more responsive
  const dotX = useSpring(mouseX, { damping: 15, stiffness: 350 });
  const dotY = useSpring(mouseY, { damping: 15, stiffness: 350 });

  // Calculate velocity/tilt for 3D depth simulation
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Only enable on desktop devices with fine cursor support
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    setIsVisible(true);

    let lastX = 0;
    let lastY = 0;
    let lastTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Compute velocity for 3D tilt
      const now = Date.now();
      const dt = now - lastTime;
      if (dt > 10) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        
        // Clamp and smooth velocity
        setVelocity({
          x: Math.max(-15, Math.min(15, (dx / dt) * 12)),
          y: Math.max(-15, Math.min(15, (dy / dt) * 12))
        });

        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    // Global listener for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest("button, a, input, select, textarea, [role='button'], .clickable-card, [data-cursor]");
      if (interactive) {
        setIsHovered(true);
        const customCursorText = (interactive as HTMLElement).getAttribute("data-cursor");
        setHoverType(customCursorText || "click");
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest("button, a, input, select, textarea, [role='button'], .clickable-card, [data-cursor]");
      if (interactive) {
        setIsHovered(false);
        setHoverType(null);
      }
    };

    // Keep cursor within window boundaries, hide when leaves
    const handleMouseLeaveWindow = () => setIsVisible(false);
    const handleMouseEnterWindow = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
    };
  }, [mouseX, mouseY]);

  // Transform velocity into 3D rotations (pitch and roll)
  const rotateX = -velocity.y * 1.5; // Up/down movement rotates around X
  const rotateY = velocity.x * 1.5;  // Left/right movement rotates around Y

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      {/* Outer 3D perspective ring */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          transform: "translate(-50%, -50%)",
          transformStyle: "preserve-3d",
          perspective: 800,
        }}
        animate={{
          scale: isClicked ? 0.85 : isHovered ? 1.4 : 1,
        }}
        className="absolute left-0 top-0 flex items-center justify-center"
      >
        <motion.div
          animate={{
            rotateX: rotateX,
            rotateY: rotateY,
            borderColor: isHovered ? "rgba(41, 134, 240, 0.8)" : "rgba(110, 120, 140, 0.3)",
            backgroundColor: isHovered ? "rgba(41, 134, 240, 0.08)" : "rgba(0, 0, 0, 0)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            transformStyle: "preserve-3d",
          }}
          className={`h-10 w-10 rounded-full border-2 border-solid shadow-[0_0_15px_rgba(41,134,240,0.15)] flex items-center justify-center transition-colors duration-150`}
        >
          {/* Subtle 3D Depth Rings inside */}
          <div 
            style={{ transform: "translateZ(6px)" }}
            className={`absolute inset-1.5 rounded-full border border-dashed ${
              isHovered ? "border-sky-400/30 animate-spin" : "border-slate-500/10"
            }`}
          />
          
          <div 
            style={{ transform: "translateZ(-4px)" }}
            className={`absolute inset-0.5 rounded-full border border-dotted ${
              isHovered ? "border-blue-500/20" : "border-transparent"
            }`}
          />

          {/* Mini dynamic badge indicator inside the ring under hover */}
          {isHovered && hoverType && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ transform: "translateZ(10px)" }}
              className="absolute text-[8px] font-sans font-semibold tracking-widest text-blue-500 uppercase bg-card/95 px-1.5 py-0.5 rounded-md border border-blue-500/20 shadow-md whitespace-nowrap"
            >
              {hoverType}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Center 3D glowing tracking dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: isClicked ? 1.5 : isHovered ? 0.5 : 1,
        }}
        className="absolute left-0 top-0 flex items-center justify-center"
      >
        <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#2986f0] relative">
          {/* Wave ripple effect on hover */}
          {isHovered && (
            <span className="absolute inset-0 rounded-full animate-ping bg-blue-400/60 opacity-75" />
          )}
        </div>
      </motion.div>
    </div>
  );
}

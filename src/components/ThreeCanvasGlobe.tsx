import { useEffect, useRef, useState } from "react";
import { Server, Activity, Globe, Zap, Network, RefreshCw, Layers } from "lucide-react";

interface GlobeNode {
  name: string;
  region: string;
  lat: number;
  lon: number;
  x: number;
  y: number;
  z: number;
  ox: number; // static original coords
  oy: number;
  oz: number;
  color: string;
  size: number;
  pulsePhase: number;
  latencyBase: number; // in ms
  uptime: string;
}

interface LandDot {
  x: number;
  y: number;
  z: number;
  ox: number;
  oy: number;
  oz: number;
  size: number;
}

interface GlobeArc {
  fromIdx: number;
  toIdx: number;
  color: string;
  speed: number;
  offset: number;
  type: "Fiber" | "Transoceanic" | "Satellite";
  latency: number;
}

interface SurgePacket {
  arcIdx: number;
  progress: number;
  speed: number;
}

// 24x72 World Grid Map representing Earth's actual continents
const ACTUAL_WORLD_MAP = [
  "                  #####                     ######                      ", // 0
  "               #########                   #########                    ", // 1
  "     ###      ###########  ###           #############     ##           ", // 2
  "    #####    ############# ###          ############### #######         ", // 3
  "   #######  ###############            #########################        ", // 4
  "  ######### #############             ###########################       ", // 5
  " #######################              ###########################       ", // 6
  "  #####################               ##########################        ", // 7
  "   ##################                  ########################         ", // 8
  "    ###############                    #######################          ", // 9
  "     ############                      ######################   ###     ", // 10
  "      #########                        ######################  #####    ", // 11
  "       ######                         ####################### #######   ", // 12
  "        ####                           ###############################  ", // 13
  "         ###                            #############################   ", // 14
  "        #####                            ###########################    ", // 15
  "       #######                            #########################     ", // 16
  "      ########                            #######################       ", // 17
  "       ######                              #################  ###       ", // 18
  "        ####                                ###############  #####      ", // 19
  "         ##                                  #############  #######     ", // 20
  "                                               _________     _____      ", // 21
  "                                                _______       ___       ", // 22
  "                                                 _____         #        "  // 23
];

// Major Global Cloud Data Centers
const DATA_CENTERS: GlobeNode[] = [
  { name: "Ashburn DC (US-East)", region: "us-east-1", lat: 39.0, lon: -77.5, color: "#22D3EE", size: 6, pulsePhase: 0, x: 0, y: 0, z: 0, ox: 0, oy: 0, oz: 0, latencyBase: 12, uptime: "99.999%" },
  { name: "Dublin DC (EU-West)", region: "eu-west-1", lat: 53.3, lon: -6.3, color: "#06B6D4", size: 5, pulsePhase: 0.5, x: 0, y: 0, z: 0, ox: 0, oy: 0, oz: 0, latencyBase: 24, uptime: "99.998%" },
  { name: "Frankfurt DC (EU-Central)", region: "eu-central-1", lat: 50.1, lon: 8.7, color: "#3B82F6", size: 5, pulsePhase: 1.0, x: 0, y: 0, z: 0, ox: 0, oy: 0, oz: 0, latencyBase: 22, uptime: "99.999%" },
  { name: "Tokyo DC (AP-Northeast)", region: "ap-northeast-1", lat: 35.7, lon: 139.7, color: "#0EA5E9", size: 6, pulsePhase: 1.5, x: 0, y: 0, z: 0, ox: 0, oy: 0, oz: 0, latencyBase: 18, uptime: "99.999%" },
  { name: "Mumbai DC (AP-South)", region: "ap-south-1", lat: 19.1, lon: 72.9, color: "#06B6D4", size: 4.5, pulsePhase: 2.0, x: 0, y: 0, z: 0, ox: 0, oy: 0, oz: 0, latencyBase: 32, uptime: "99.997%" },
  { name: "Singapore DC (AP-Southeast)", region: "ap-southeast-1", lat: 1.3, lon: 103.8, color: "#22D3EE", size: 5, pulsePhase: 2.5, x: 0, y: 0, z: 0, ox: 0, oy: 0, oz: 0, latencyBase: 15, uptime: "99.999%" },
  { name: "Sydney DC (AP-Southeast-2)", region: "ap-southeast-2", lat: -33.9, lon: 151.2, color: "#3B82F6", size: 4.5, pulsePhase: 3.0, x: 0, y: 0, z: 0, ox: 0, oy: 0, oz: 0, latencyBase: 28, uptime: "99.998%" },
  { name: "Silicon Valley DC (US-West)", region: "us-west-2", lat: 37.4, lon: -122.0, color: "#0EA5E9", size: 6, pulsePhase: 3.5, x: 0, y: 0, z: 0, ox: 0, oy: 0, oz: 0, latencyBase: 10, uptime: "99.999%" },
  { name: "Sao Paulo DC (SA-East)", region: "sa-east-1", lat: -23.5, lon: -46.6, color: "#06B6D4", size: 4.5, pulsePhase: 4.0, x: 0, y: 0, z: 0, ox: 0, oy: 0, oz: 0, latencyBase: 35, uptime: "99.996%" },
  { name: "Cape Town DC (AF-South)", region: "af-south-1", lat: -33.9, lon: 18.4, color: "#3B82F6", size: 4, pulsePhase: 4.5, x: 0, y: 0, z: 0, ox: 0, oy: 0, oz: 0, latencyBase: 42, uptime: "99.995%" }
];

// Network Geodesic Connections
const BACKBONE_ARCS: GlobeArc[] = [
  { fromIdx: 0, toIdx: 1, color: "#22D3EE", speed: 0.0035, offset: 0.0, type: "Transoceanic", latency: 68 },  // US-East <-> Dublin
  { fromIdx: 1, toIdx: 2, color: "#12B4D9", speed: 0.0050, offset: 0.25, type: "Fiber", latency: 12 },        // Dublin <-> Frankfurt
  { fromIdx: 2, toIdx: 4, color: "#1E5FBF", speed: 0.0030, offset: 0.5, type: "Fiber", latency: 110 },       // Frankfurt <-> Mumbai
  { fromIdx: 4, toIdx: 5, color: "#22D3EE", speed: 0.0055, offset: 0.1, type: "Fiber", latency: 34 },        // Mumbai <-> Singapore
  { fromIdx: 5, toIdx: 3, color: "#12B4D9", speed: 0.0040, offset: 0.7, type: "Fiber", latency: 52 },        // Singapore <-> Tokyo
  { fromIdx: 3, toIdx: 7, color: "#0284C7", speed: 0.0028, offset: 0.35, type: "Transoceanic", latency: 82 }, // Tokyo <-> Silicon Valley
  { fromIdx: 7, toIdx: 0, color: "#1E5FBF", speed: 0.0045, offset: 0.0, type: "Fiber", latency: 45 },        // Silicon Valley <-> US-East
  { fromIdx: 0, toIdx: 8, color: "#12B4D9", speed: 0.0038, offset: 0.8, type: "Fiber", latency: 120 },       // US-East <-> Sao Paulo
  { fromIdx: 9, toIdx: 1, color: "#12B4D9", speed: 0.0032, offset: 0.45, type: "Transoceanic", latency: 145 }, // Cape Town <-> Dublin
  { fromIdx: 6, toIdx: 5, color: "#22D3EE", speed: 0.0048, offset: 0.2, type: "Transoceanic", latency: 98 },  // Sydney <-> Singapore
  { fromIdx: 6, toIdx: 7, color: "#1E5FBF", speed: 0.0036, offset: 0.6, type: "Satellite", latency: 135 }     // Sydney <-> Silicon Valley
];

export default function ThreeCanvasGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive Component State
  const [activeHub, setActiveHub] = useState<number | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [routingStatus, setRoutingStatus] = useState<"optimal" | "rerouting" | "verifying">("optimal");
  const [mouse, setMouse] = useState({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [leadThroughput, setLeadThroughput] = useState(412.8); // Gbps
  const [packetLoss, setPacketLoss] = useState(0.0004); // %

  const activeHubRef = useRef<number | null>(null);
  const surgePacketsRef = useRef<SurgePacket[]>([]);
  const projectedNodesRef = useRef<{ index: number; x: number; y: number; name: string }[]>([]);

  // Simulation of fluctuating throughput metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setLeadThroughput((prev) => {
        const delta = (Math.random() - 0.5) * 8.5;
        return parseFloat(Math.max(380, Math.min(460, prev + delta)).toFixed(1));
      });
      setPacketLoss((prev) => {
        const delta = (Math.random() - 0.5) * 0.0001;
        return parseFloat(Math.max(0.0001, Math.min(0.0015, prev + delta)).toFixed(4));
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Trigger high intensity surge wave
  const handleTriggerSurge = () => {
    const newPackets = BACKBONE_ARCS.map((_, idx) => ({
      arcIdx: idx,
      progress: 0,
      speed: 0.012 + Math.random() * 0.008
    }));
    surgePacketsRef.current = [...surgePacketsRef.current, ...newPackets];
  };

  // Trigger manual backbone route recalculation
  const handleReroute = () => {
    setRoutingStatus("rerouting");
    setTimeout(() => {
      setRoutingStatus("verifying");
      setTimeout(() => {
        setRoutingStatus("optimal");
        // Create an immediate ripple pulse surge upon recovery
        handleTriggerSurge();
      }, 1000);
    }, 1200);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const radius = Math.min(width, height, 400) * 0.42 || 150;

    // Helper for spherical coords mapping
    const getSphericalCoords = (lat: number, lon: number, r: number) => {
      const latRad = (lat * Math.PI) / 180;
      const lonRad = (lon * Math.PI) / 180;
      return {
        ox: r * Math.cos(latRad) * Math.sin(lonRad),
        oy: r * Math.sin(latRad),
        oz: r * Math.cos(latRad) * Math.cos(lonRad)
      };
    };

    // Spherical Linear Interpolation (SLERP) for true geodesic paths with parabolic elevation
    const getGeodesicPoint = (
      pA: { ox: number; oy: number; oz: number },
      pB: { ox: number; oy: number; oz: number },
      t: number,
      maxArcHeight: number,
      r: number
    ) => {
      const lenA = Math.hypot(pA.ox, pA.oy, pA.oz);
      const lenB = Math.hypot(pB.ox, pB.oy, pB.oz);
      
      if (lenA === 0 || lenB === 0) return { ox: 0, oy: 0, oz: 0 };
      
      const uxA = pA.ox / lenA;
      const uyA = pA.oy / lenA;
      const uzA = pA.oz / lenA;
      
      const uxB = pB.ox / lenB;
      const uyB = pB.oy / lenB;
      const uzB = pB.oz / lenB;
      
      // Dot product to find angle
      let dot = uxA * uxB + uyA * uyB + uzA * uzB;
      dot = Math.max(-1, Math.min(1, dot));
      
      const theta = Math.acos(dot);
      const sinTheta = Math.sin(theta);
      
      let ux, uy, uz;
      if (sinTheta < 0.001) {
        // Fallback to linear interpolation for very close antipodals
        ux = uxA + (uxB - uxA) * t;
        uy = uyA + (uyB - uyA) * t;
        uz = uzA + (uzB - uzA) * t;
        const len = Math.hypot(ux, uy, uz);
        if (len > 0) {
          ux /= len;
          uy /= len;
          uz /= len;
        }
      } else {
        // Spherical linear formula
        const factorA = Math.sin((1 - t) * theta) / sinTheta;
        const factorB = Math.sin(t * theta) / sinTheta;
        ux = uxA * factorA + uxB * factorB;
        uy = uyA * factorA + uyB * factorB;
        uz = uzA * factorA + uzB * factorB;
      }
      
      // Compute geodesic path elevation above the sphere surface
      const archHeight = r * maxArcHeight * Math.sin(t * Math.PI);
      const totalR = r + archHeight;
      
      return {
        ox: ux * totalR,
        oy: uy * totalR,
        oz: uz * totalR
      };
    };

    // Generate geographic landmass dots from ACTUAL_WORLD_MAP
    const landDots: LandDot[] = [];
    const rowsCount = ACTUAL_WORLD_MAP.length;
    const colsCount = 72;

    for (let r = 0; r < rowsCount; r++) {
      const rowStr = ACTUAL_WORLD_MAP[r];
      const lat = 90 - (r / (rowsCount - 1)) * 180;

      for (let c = 0; c < colsCount; c++) {
        if (rowStr[c] === "#") {
          const lon = (c / (colsCount - 1)) * 360 - 180;
          const jitterLat = lat + (Math.random() - 0.5) * 1.5;
          const jitterLon = lon + (Math.random() - 0.5) * 1.5;

          const coords = getSphericalCoords(jitterLat, jitterLon, radius);
          landDots.push({
            x: coords.ox,
            y: coords.oy,
            z: coords.oz,
            ox: coords.ox,
            oy: coords.oy,
            oz: coords.oz,
            size: Math.random() * 1.4 + 0.9
          });
        }
      }
    }

    // Grid line points for 3D sphere wireframe parallels & meridians
    const gridLines: { points: { ox: number; oy: number; oz: number }[] }[] = [];

    // Latitude parallels
    const latLines = [-60, -30, 0, 30, 60];
    latLines.forEach((lat) => {
      const points: { ox: number; oy: number; oz: number }[] = [];
      for (let lon = -180; lon <= 180; lon += 8) {
        points.push(getSphericalCoords(lat, lon, radius));
      }
      gridLines.push({ points });
    });

    // Longitude meridians
    const lonLines = [-150, -100, -50, 0, 50, 100, 150];
    lonLines.forEach((lon) => {
      const points: { ox: number; oy: number; oz: number }[] = [];
      for (let lat = -90; lat <= 90; lat += 8) {
        points.push(getSphericalCoords(lat, lon, radius));
      }
      gridLines.push({ points });
    });

    // Initialize Data Center Nodes
    const nodes: GlobeNode[] = DATA_CENTERS.map((city) => {
      const coords = getSphericalCoords(city.lat, city.lon, radius);
      return {
        ...city,
        x: coords.ox,
        y: coords.oy,
        z: coords.oz,
        ox: coords.ox,
        oy: coords.oy,
        oz: coords.oz,
        pulsePhase: Math.random() * Math.PI * 2
      };
    });

    let baseRotationY = 0;
    let baseRotationX = 0.15; // static camera tilt for beautiful 3D viewport
    let animTime = 0;

    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let lastInteractionTime = 0;

    canvas.style.cursor = "grab";

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        isDragging = true;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
        lastInteractionTime = Date.now();
        canvas.style.cursor = "grabbing";
      }
    };

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;

        baseRotationY += deltaX * 0.006;
        baseRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, baseRotationX + deltaY * 0.006));

        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
        lastInteractionTime = Date.now();
      }
    };

    const handleWindowMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        canvas.style.cursor = "grab";
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const mouseX = touch.clientX - rect.left;
        const mouseY = touch.clientY - rect.top;

        if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
          isDragging = true;
          previousMouseX = touch.clientX;
          previousMouseY = touch.clientY;
          lastInteractionTime = Date.now();
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - previousMouseX;
        const deltaY = touch.clientY - previousMouseY;

        baseRotationY += deltaX * 0.008;
        baseRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, baseRotationX + deltaY * 0.008));

        previousMouseX = touch.clientX;
        previousMouseY = touch.clientY;
        lastInteractionTime = Date.now();

        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const rx = mouseX - width / 2;
      const ry = mouseY - height / 2;
      setMouse((prev) => ({
        ...prev,
        targetX: rx * 0.0012,
        targetY: ry * 0.0012
      }));

      // Find hovered node via screen projections
      let foundIdx: number | null = null;
      for (const pNode of projectedNodesRef.current) {
        const dist = Math.hypot(mouseX - pNode.x, mouseY - pNode.y);
        if (dist < 18) {
          foundIdx = pNode.index;
          break;
        }
      }
      
      if (foundIdx !== activeHubRef.current) {
        activeHubRef.current = foundIdx;
        setActiveHub(foundIdx);
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Rotate slowly only if not interacting
      if (!isDragging && Date.now() - lastInteractionTime > 3000) {
        baseRotationY += activeHubRef.current !== null ? 0.0003 : 0.0010;
      }
      animTime += 1;

      const rotY = baseRotationY;
      const rotX = baseRotationX;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const cx = width / 2;
      const cy = height / 2;
      const cameraDistance = radius * 2.3;

      // Project Land Particles
      landDots.forEach((d) => {
        let x1 = d.ox * cosY - d.oz * sinY;
        let z1 = d.ox * sinY + d.oz * cosY;

        let y2 = d.oy * cosX - z1 * sinX;
        let z2 = d.oy * sinX + z1 * cosX;

        d.x = x1;
        d.y = y2;
        d.z = z2;
      });

      // Project Data Centers
      nodes.forEach((n) => {
        let x1 = n.ox * cosY - n.oz * sinY;
        let z1 = n.ox * sinY + n.oz * cosY;

        let y2 = n.oy * cosX - z1 * sinX;
        let z2 = n.oy * sinX + z1 * cosX;

        n.x = x1;
        n.y = y2;
        n.z = z2;
        n.pulsePhase += 0.05;
      });

      // Save projected screen positions for mouse collision tracking
      projectedNodesRef.current = nodes.map((n, idx) => {
        const scale = cameraDistance / (cameraDistance - n.z);
        const px = cx + n.x * scale;
        const py = cy - n.y * scale;
        return { index: idx, x: px, y: py, name: n.name };
      });

      // 1. Draw Glassy Globe Core Depth Shading
      const glowGrad = ctx.createRadialGradient(
        cx - radius * 0.25,
        cy - radius * 0.25,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      glowGrad.addColorStop(0, "rgba(224, 242, 254, 0.90)"); // Highlights
      glowGrad.addColorStop(0.65, "rgba(186, 230, 253, 0.35)");
      glowGrad.addColorStop(1, "rgba(14, 165, 233, 0.06)"); // Deep ocean shade

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric glowing rim border
      ctx.strokeStyle = "rgba(14, 165, 233, 0.22)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Render latitude/longitude meridians if toggled
      if (showGrid) {
        ctx.lineWidth = 0.8;
        gridLines.forEach((line) => {
          ctx.beginPath();
          let isDrawing = false;

          line.points.forEach((pt) => {
            const x1 = pt.ox * cosY - pt.oz * sinY;
            const z1 = pt.ox * sinY + pt.oz * cosY;

            const y2 = pt.oy * cosX - z1 * sinX;
            const z2 = pt.oy * sinX + z1 * cosX;

            // Only render front hemisphere of the wireframe grid
            if (z2 > -10) {
              const scale = cameraDistance / (cameraDistance - z2);
              const sx = cx + x1 * scale;
              const sy = cy - y2 * scale;

              if (!isDrawing) {
                ctx.moveTo(sx, sy);
                isDrawing = true;
              } else {
                ctx.lineTo(sx, sy);
              }
            } else {
              isDrawing = false;
            }
          });

          ctx.strokeStyle = "rgba(14, 165, 233, 0.09)";
          ctx.stroke();
        });
      }

      // 3. Draw Land Particles
      landDots.forEach((d) => {
        if (d.z < -4) return; // clip back hemisphere

        const scale = cameraDistance / (cameraDistance - d.z);
        const px = cx + d.x * scale;
        const py = cy - d.y * scale;

        const depthAlpha = Math.max(0.1, (d.z + radius) / (radius * 2));
        ctx.fillStyle = `rgba(2, 132, 199, ${depthAlpha * 0.70})`;
        ctx.beginPath();
        ctx.arc(px, py, d.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Render True Geodesic Connection Arcs with Multi-packets & Pulse Surges
      BACKBONE_ARCS.forEach((arc, arcIdx) => {
        const fromNode = nodes[arc.fromIdx];
        const toNode = nodes[arc.toIdx];

        // Spherical linear projection math to generate geodesic curve
        const steps = 30;
        const points: { x: number; y: number; z: number; staticPt: { ox: number, oy: number, oz: number } }[] = [];
        const heightFactor = 0.16 + (Math.hypot(fromNode.ox - toNode.ox, fromNode.oy - toNode.oy, fromNode.oz - toNode.oz) / (radius * 2)) * 0.30;

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const staticPt = getGeodesicPoint(fromNode, toNode, t, heightFactor, radius);

          // Rotate statically mapped geodesic point dynamically
          const x1 = staticPt.ox * cosY - staticPt.oz * sinY;
          const z1 = staticPt.ox * sinY + staticPt.oz * cosY;

          const y2 = staticPt.oy * cosX - z1 * sinX;
          const z2 = staticPt.oy * sinX + z1 * cosX;

          points.push({ x: x1, y: y2, z: z2, staticPt });
        }

        // Draw the geodesic curve line
        ctx.beginPath();
        let isArcDrawing = false;

        points.forEach((pt) => {
          const scale = cameraDistance / (cameraDistance - pt.z);
          const sx = cx + pt.x * scale;
          const sy = cy - pt.y * scale;

          if (pt.z > -15) {
            if (!isArcDrawing) {
              ctx.moveTo(sx, sy);
              isArcDrawing = true;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            isArcDrawing = false;
          }
        });

        const zAvg = (points[0].z + points[steps].z) / 2;
        let arcAlpha = Math.max(0.04, (zAvg + radius) / (radius * 2)) * 0.5;

        // Visual highlighting for paths connected to the selected/hovered hub node
        const isConnectedToSelected = activeHubRef.current !== null && (arc.fromIdx === activeHubRef.current || arc.toIdx === activeHubRef.current);
        if (activeHubRef.current !== null) {
          arcAlpha = isConnectedToSelected ? arcAlpha * 2.2 : arcAlpha * 0.25;
        }

        // Rerouting route visual stress simulation
        if (routingStatus === "rerouting") {
          ctx.strokeStyle = `rgba(244, 63, 94, ${arcAlpha * 1.4})`; // alarm red
          ctx.lineWidth = 1.0;
        } else if (routingStatus === "verifying") {
          ctx.strokeStyle = `rgba(234, 179, 8, ${arcAlpha * 1.4})`; // warning yellow
          ctx.lineWidth = 1.2;
        } else {
          // Standard high-tech colors representing different packet route mediums
          ctx.strokeStyle = isConnectedToSelected 
            ? `rgba(254, 240, 138, ${arcAlpha})` // bright golden active route
            : arc.type === "Satellite"
            ? `rgba(168, 85, 247, ${arcAlpha})`  // high purple satellites
            : arc.type === "Transoceanic"
            ? `rgba(34, 211, 238, ${arcAlpha})`  // neon blue undersea cables
            : `rgba(59, 130, 246, ${arcAlpha})`;  // royal blue terrestrial fiber
          ctx.lineWidth = isConnectedToSelected ? 2.0 : 1.3;
        }
        ctx.stroke();

        // Standard Continuous Packet Data flows
        const tPacket = (animTime * arc.speed + arc.offset) % 1.0;
        const packetIdx = Math.floor(tPacket * steps);
        const p1 = points[packetIdx];
        const p2 = points[Math.min(packetIdx + 1, steps)];

        if (p1 && p2 && p1.z > -5 && routingStatus === "optimal") {
          const subT = (tPacket * steps) % 1.0;
          const pktX = p1.x + (p2.x - p1.x) * subT;
          const pktY = p1.y + (p2.y - p1.y) * subT;
          const pktZ = p1.z + (p2.z - p1.z) * subT;

          const scale = cameraDistance / (cameraDistance - pktZ);
          const sx = cx + pktX * scale;
          const sy = cy - pktY * scale;

          ctx.shadowColor = arc.color;
          ctx.shadowBlur = isConnectedToSelected ? 12 : 6;
          ctx.fillStyle = isConnectedToSelected ? "#FDE047" : "#FFFFFF";
          ctx.beginPath();
          ctx.arc(sx, sy, (isConnectedToSelected ? 3.0 : 2.0) * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 5. Render Active High-Speed Laser Surge Packets (Cyber pulses)
      const currentSurge = [...surgePacketsRef.current];
      const remainingSurge: SurgePacket[] = [];

      currentSurge.forEach((sp) => {
        sp.progress += sp.speed;
        if (sp.progress < 1.0) {
          remainingSurge.push(sp);

          const arc = BACKBONE_ARCS[sp.arcIdx];
          const fromNode = nodes[arc.fromIdx];
          const toNode = nodes[arc.toIdx];

          const steps = 30;
          const heightFactor = 0.16 + (Math.hypot(fromNode.ox - toNode.ox, fromNode.oy - toNode.oy, fromNode.oz - toNode.oz) / (radius * 2)) * 0.30;
          const staticPt = getGeodesicPoint(fromNode, toNode, sp.progress, heightFactor, radius);

          const x1 = staticPt.ox * cosY - staticPt.oz * sinY;
          const z1 = staticPt.ox * sinY + staticPt.oz * cosY;
          const y2 = staticPt.oy * cosX - z1 * sinX;
          const z2 = staticPt.oy * sinX + z1 * cosX;

          if (z2 > -5) {
            const scale = cameraDistance / (cameraDistance - z2);
            const sx = cx + x1 * scale;
            const sy = cy - y2 * scale;

            // Highly visible fiber core fire pulse
            ctx.shadowColor = "#F97316"; // Bright orange
            ctx.shadowBlur = 15;
            ctx.fillStyle = "#FFEDD5";
            ctx.beginPath();
            ctx.arc(sx, sy, 4.5 * scale, 0, Math.PI * 2);
            ctx.fill();

            // Trail particle
            ctx.fillStyle = "rgba(249, 115, 22, 0.4)";
            ctx.beginPath();
            ctx.arc(sx, sy, 7.0 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });
      surgePacketsRef.current = remainingSurge;

      // 6. Render Data Center Node Hubs
      const sortedNodes = [...nodes].sort((a, b) => a.z - b.z);
      sortedNodes.forEach((n) => {
        if (n.z < -6) return; // backend clip

        const scale = cameraDistance / (cameraDistance - n.z);
        const px = cx + n.x * scale;
        const py = cy - n.y * scale;

        const isHovered = activeHubRef.current !== null && nodes[activeHubRef.current].name === n.name;
        const depthAlpha = Math.max(0.1, (n.z + radius) / (radius * 2));
        const pulse = 1 + Math.sin(n.pulsePhase) * 0.32;

        // Concentric targeted pulsing halo on selected or hovered node
        if (isHovered) {
          ctx.strokeStyle = "#FDE047"; // gold aura
          ctx.globalAlpha = depthAlpha * 0.75;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.arc(px, py, n.size * 3.5 * pulse * scale, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = "rgba(254, 224, 71, 0.35)";
          ctx.beginPath();
          ctx.arc(px, py, n.size * 5.0 * scale, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Standard operational outer radar pulse
        ctx.strokeStyle = n.color;
        ctx.globalAlpha = depthAlpha * 0.45;
        ctx.lineWidth = isHovered ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.arc(px, py, n.size * 2 * pulse * scale, 0, Math.PI * 2);
        ctx.stroke();

        // Solid node core
        ctx.shadowColor = isHovered ? "#FDE047" : n.color;
        ctx.shadowBlur = isHovered ? 12 : 8;
        ctx.fillStyle = isHovered ? "#FDE047" : "#FFFFFF";
        ctx.globalAlpha = depthAlpha * 0.98;
        ctx.beginPath();
        ctx.arc(px, py, (isHovered ? n.size * 0.9 : n.size * 0.7) * scale, 0, Math.PI * 2);
        ctx.fill();

        // Premium Labels (Only visible on front face and fully sharp)
        if (depthAlpha > 0.68) {
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;

          // Dynamic text contrast support
          ctx.fillStyle = isHovered ? "rgba(15, 23, 42, 1)" : "rgba(15, 23, 42, 0.85)";
          ctx.font = isHovered 
            ? "bold 10px JetBrains Mono, monospace" 
            : "bold 9px JetBrains Mono, monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(n.name, px, py + n.size * 2.8 * scale);
        }

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [showGrid, routingStatus]);

  // Handle manual selection clicks from the left list
  const handleSelectNodeFromList = (idx: number) => {
    setActiveHub(idx);
    activeHubRef.current = idx;
  };

  const selectedNodeObj = activeHub !== null ? DATA_CENTERS[activeHub] : null;

  return (
    <div
      ref={containerRef}
      id="globe-network-container"
      className="w-full flex flex-col items-stretch justify-start relative overflow-hidden bg-card/60 rounded-3xl border border-border-custom p-4 shadow-inner"
    >
      
      {/* 1. TOP LIVE NETWORK HEAD-UP DISPLAY (HUD) - Non-absolute block so it doesn't cover connections */}
      <div className="w-full flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 border-b border-border-custom/50 pb-3 mb-2 z-10">
        
        {/* Left Side: System status metrics */}
        <div className="flex items-center gap-3 bg-bg/50 px-3.5 py-2 rounded-xl border border-border-custom/80 shadow-sm">
          <span className={`h-2.5 w-2.5 rounded-full ${
            routingStatus === "optimal" ? "bg-emerald-500 animate-pulse" :
            routingStatus === "rerouting" ? "bg-rose-500 animate-ping" : "bg-amber-500 animate-spin"
          }`} />
          <span className="text-[10px] font-mono font-black text-text-primary uppercase tracking-wider">
            {routingStatus === "optimal" ? "BACKBONE STATE: OPTIMAL" :
             routingStatus === "rerouting" ? "BACKBONE STATE: REROUTING" : "BACKBONE STATE: REBUILDING"}
          </span>
        </div>

        {/* Right Side: Real-time Fluctuating metrics */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-4 gap-y-1 bg-bg/50 px-3.5 py-2 rounded-xl border border-border-custom/80 text-[10px] font-mono text-text-secondary">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
            <span>Global Load: <span className="text-primary font-bold">{leadThroughput} Gbps</span></span>
          </div>
          <div className="sm:border-l sm:border-border-custom/50 sm:pl-3">
            <span>Pkt Loss: <span className="text-primary font-bold">{packetLoss}%</span></span>
          </div>
          <div className="sm:border-l sm:border-border-custom/50 sm:pl-3">
            <span>Transit: <span className="text-emerald-500 font-bold">100% Core</span></span>
          </div>
          <div className="sm:border-l sm:border-border-custom/50 sm:pl-3">
            <span>D-Centers: <span className="text-text-primary font-bold">10 Active</span></span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CANVAS VIEW */}
      <div className="w-full h-[280px] md:h-[350px] flex items-center justify-center relative cursor-grab active:cursor-grabbing">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 rounded-full filter blur-3xl opacity-50 mix-blend-screen pointer-events-none" />
        <canvas ref={canvasRef} className="block" />

        {/* 3. INTERACTIVE CORNER HUD SHOWING SELECTED DATA CENTER */}
        {selectedNodeObj && (
          <div className="absolute bottom-2 left-2 max-w-[210px] bg-bg/95 backdrop-blur-md p-3 rounded-xl border border-border-custom shadow-md text-left animate-fade-in z-20">
            <div className="flex items-center gap-2 pb-1.5 border-b border-border-custom">
              <Server className="h-4 w-4 text-cyan-400 animate-pulse" />
              <div className="min-w-0">
                <h4 className="text-[11px] font-bold text-text-primary truncate font-display">
                  {selectedNodeObj.name}
                </h4>
                <p className="text-[9px] font-mono text-text-secondary truncate uppercase tracking-widest">
                  {selectedNodeObj.region}
                </p>
              </div>
            </div>
            
            <div className="space-y-1.5 pt-2 text-[10px] font-mono text-text-secondary">
              <div className="flex justify-between">
                <span>Core Ping:</span>
                <span className="text-text-primary font-bold flex items-center gap-1">
                  <Activity className="h-3 w-3 text-emerald-400" />
                  {selectedNodeObj.latencyBase}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span>Uptime SLA:</span>
                <span className="text-emerald-500 font-bold">{selectedNodeObj.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span>Node Status:</span>
                <span className="text-cyan-400 font-bold uppercase tracking-wider">ONLINE</span>
              </div>
              
              <div className="flex flex-wrap gap-1 pt-1.5 border-t border-border-custom">
                <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-bold uppercase">
                  GIGA-CAPABLE
                </span>
                <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-md font-bold uppercase">
                  PEER DIRECT
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. LINK MEDIUM LEGEND - Relocated as a clean horizontal ribbon below the canvas so it doesn't block connections */}
      <div className="w-full flex flex-wrap justify-center items-center gap-x-6 gap-y-2 py-2 border-t border-border-custom/50 bg-bg/20 rounded-xl text-[10px] font-mono text-text-secondary mb-3">
        <span className="font-bold text-text-primary text-[10px] flex items-center gap-1">
          <Layers className="h-3.5 w-3.5 text-primary" />
          <span>LINK MEDIUM:</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-3 rounded-full bg-cyan-400" />
          <span>Undersea Cable (Trans)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-3 rounded-full bg-blue-500" />
          <span>Terrestrial Fiber (Direct)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-3 rounded-full bg-purple-500" />
          <span>Satellite Uplink (Orbits)</span>
        </div>
      </div>

      {/* 5. HIGH-TECH BOTTOM SIMULATOR CONTROL BAR */}
      <div className="w-full pt-3.5 border-t border-border-custom flex flex-col md:flex-row gap-3 items-center justify-between z-10 bg-bg/40 p-3 rounded-2xl">
        
        {/* Left Side: Select Quick Hub shortcuts */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          <span className="text-[9.5px] font-mono font-bold text-text-secondary uppercase tracking-widest shrink-0">
            Node Hubs:
          </span>
          {DATA_CENTERS.slice(0, 5).map((dc, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectNodeFromList(idx)}
              className={`px-2 py-1 text-[9px] font-mono font-semibold rounded-lg border transition-all shrink-0 cursor-pointer ${
                activeHub === idx
                  ? "bg-primary border-primary text-white shadow-sm"
                  : "bg-card border-border-custom text-text-secondary hover:border-primary/20 hover:text-text-primary"
              }`}
            >
              {dc.name.split(" ")[0]}
            </button>
          ))}
          {activeHub !== null && (
            <button
              onClick={() => {
                setActiveHub(null);
                activeHubRef.current = null;
              }}
              className="px-2 py-1 text-[9px] font-mono font-bold text-rose-500 hover:text-rose-600 shrink-0"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right Side: Command Action triggers */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Recalculate route paths */}
          <button
            onClick={handleReroute}
            disabled={routingStatus !== "optimal"}
            title="Recalculate Optimal Geodesic Routes"
            className="p-2 rounded-xl border border-border-custom bg-card text-text-secondary hover:text-text-primary hover:border-primary/20 transition-all cursor-pointer flex items-center justify-center disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${routingStatus !== "optimal" ? "animate-spin text-amber-500" : ""}`} />
          </button>

          {/* Surge trigger pulse */}
          <button
            onClick={handleTriggerSurge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white text-[10px] font-bold shadow-md cursor-pointer transition-all uppercase tracking-wider"
          >
            <Zap className="h-3.5 w-3.5 text-amber-300 fill-amber-300 animate-pulse" />
            <span>Laser Surge</span>
          </button>

        </div>
      </div>

    </div>
  );
}

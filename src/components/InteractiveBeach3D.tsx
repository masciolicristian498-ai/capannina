import React, { useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'motion/react';

export function InteractiveBeach3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Layer transforms at different depths
  const skyX    = useTransform(springX, [-1, 1], [-6,  6]);
  const skyY    = useTransform(springY, [-1, 1], [-3,  3]);
  const seaX    = useTransform(springX, [-1, 1], [-12, 12]);
  const seaY    = useTransform(springY, [-1, 1], [-5,  5]);
  const midX    = useTransform(springX, [-1, 1], [-20, 20]);
  const midY    = useTransform(springY, [-1, 1], [-8,  8]);
  const frontX  = useTransform(springX, [-1, 1], [-30, 30]);
  const frontY  = useTransform(springY, [-1, 1], [-12, 12]);
  const rotX    = useTransform(springY, [-1, 1], [6,  -6]);
  const rotY    = useTransform(springX, [-1, 1], [-8,  8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    mouseX.set(nx);
    mouseY.set(ny);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full select-none"
      style={{ perspective: '900px' }}
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        className="w-full h-full relative"
      >
        {/* ── Layer 0: Sky gradient ── */}
        <motion.div style={{ x: skyX, y: skyY }} className="absolute inset-0">
          <svg viewBox="0 0 380 280" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="skyBg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#bfdbfe"/>
                <stop offset="60%" stopColor="#e0f2fe"/>
                <stop offset="100%" stopColor="#bae6fd"/>
              </linearGradient>
            </defs>
            <rect width="380" height="280" fill="url(#skyBg)" rx="20"/>
          </svg>
        </motion.div>

        {/* ── Layer 1: Sun + rays ── */}
        <motion.div style={{ x: skyX, y: skyY }} className="absolute inset-0 pointer-events-none">
          <svg viewBox="0 0 380 280" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(300, 55)">
              {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
                <motion.line key={i}
                  x1="0" y1="0"
                  x2={Math.cos(deg*Math.PI/180)*52} y2={Math.sin(deg*Math.PI/180)*52}
                  stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"
                  animate={{ opacity: [0.6, 0.3, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
              <motion.circle r="28" fill="#fbbf24" opacity="0.95"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <circle r="22" fill="#fde047" opacity="0.8"/>
            </g>
          </svg>
        </motion.div>

        {/* ── Layer 2: Clouds ── */}
        <motion.div style={{ x: seaX, y: skyY }} className="absolute inset-0 pointer-events-none">
          <svg viewBox="0 0 380 280" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Cloud 1 */}
            <motion.g animate={{ x: [0, 12, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
              <ellipse cx="80" cy="55" rx="34" ry="18" fill="white" opacity="0.85"/>
              <ellipse cx="60" cy="62" rx="22" ry="14" fill="white" opacity="0.85"/>
              <ellipse cx="105" cy="62" rx="26" ry="14" fill="white" opacity="0.85"/>
            </motion.g>
            {/* Cloud 2 */}
            <motion.g animate={{ x: [0, -8, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}>
              <ellipse cx="230" cy="38" rx="28" ry="15" fill="white" opacity="0.7"/>
              <ellipse cx="215" cy="44" rx="18" ry="12" fill="white" opacity="0.7"/>
              <ellipse cx="248" cy="43" rx="20" ry="12" fill="white" opacity="0.7"/>
            </motion.g>
          </svg>
        </motion.div>

        {/* ── Layer 3: sea horizon ── */}
        <motion.div style={{ x: seaX, y: seaY }} className="absolute inset-0 pointer-events-none">
          <svg viewBox="0 0 380 280" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8"/>
                <stop offset="100%" stopColor="#0369a1"/>
              </linearGradient>
            </defs>
            <rect x="0" y="130" width="380" height="80" fill="url(#seaGrad)"/>
            {/* Wave lines */}
            {[0,1,2,3].map(i => (
              <motion.path key={i}
                d={`M0,${145+i*8} Q95,${139+i*8} 190,${145+i*8} Q285,${151+i*8} 380,${145+i*8}`}
                fill="none" stroke="#e0f7ff" strokeWidth="1.5" opacity="0.5"
                animate={{ d: [
                  `M0,${145+i*8} Q95,${139+i*8} 190,${145+i*8} Q285,${151+i*8} 380,${145+i*8}`,
                  `M0,${141+i*8} Q95,${147+i*8} 190,${141+i*8} Q285,${135+i*8} 380,${141+i*8}`,
                  `M0,${145+i*8} Q95,${139+i*8} 190,${145+i*8} Q285,${151+i*8} 380,${145+i*8}`,
                ]}}
                transition={{ duration: 2.5+i*0.5, repeat: Infinity, ease: "easeInOut", delay: i*0.4 }}
              />
            ))}
            {/* Sailboat */}
            <motion.g animate={{ x: [0, 30, 0], y: [0, -3, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}>
              <polygon points="120,130 140,80 160,130" fill="white" opacity="0.9"/>
              <polygon points="120,130 118,102 135,130" fill="#e2f8ff" opacity="0.8"/>
              <rect x="118" y="128" width="44" height="7" rx="3" fill="#60a5fa" opacity="0.9"/>
            </motion.g>
          </svg>
        </motion.div>

        {/* ── Layer 4: Beach / sand ── */}
        <motion.div style={{ x: midX, y: midY }} className="absolute inset-0 pointer-events-none">
          <svg viewBox="0 0 380 280" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fde68a"/>
                <stop offset="100%" stopColor="#f59e0b"/>
              </linearGradient>
            </defs>
            <path d="M0,200 Q95,185 190,200 Q285,215 380,200 L380,280 L0,280 Z" fill="url(#sandGrad)"/>
            {/* Sand texture dots */}
            {[[60,220],[130,235],[200,218],[270,240],[320,225],[90,250],[180,255],[250,248]].map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r="2" fill="#d97706" opacity="0.3"/>
            ))}
          </svg>
        </motion.div>

        {/* ── Layer 5: Umbrella + chairs (closest) ── */}
        <motion.div style={{ x: frontX, y: frontY }} className="absolute inset-0 pointer-events-none">
          <svg viewBox="0 0 380 280" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Big umbrella */}
            <defs>
              <radialGradient id="umbrellaGrad" cx="50%" cy="0%" r="100%">
                <stop offset="0%" stopColor="#f97316"/>
                <stop offset="100%" stopColor="#dc2626"/>
              </radialGradient>
            </defs>
            {/* Pole */}
            <line x1="190" y1="172" x2="190" y2="260" stroke="#78350f" strokeWidth="4" strokeLinecap="round"/>
            {/* Canopy segments */}
            {[0,1,2,3,4,5].map(i => (
              <path key={i}
                d={`M190,172 L${190+Math.cos((i*60-90)*Math.PI/180)*88},${172+Math.sin((i*60-90)*Math.PI/180)*38} A88,38 0 0,1 ${190+Math.cos(((i+1)*60-90)*Math.PI/180)*88},${172+Math.sin(((i+1)*60-90)*Math.PI/180)*38} Z`}
                fill={i%2===0 ? "#f97316" : "#dc2626"} opacity="0.95"
              />
            ))}
            {/* Center cap */}
            <circle cx="190" cy="172" r="9" fill="#78350f"/>
            {/* Lounger L */}
            <rect x="125" y="235" width="55" height="14" rx="4" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5"/>
            <rect x="125" y="225" width="32" height="11" rx="3" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5"/>
            <ellipse cx="145" cy="223" rx="10" ry="10" fill="#fdba74"/>
            {/* Lounger R */}
            <rect x="200" y="235" width="55" height="14" rx="4" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5"/>
            <rect x="223" y="225" width="32" height="11" rx="3" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5"/>
            <ellipse cx="239" cy="223" rx="10" ry="10" fill="#fdba74"/>
            {/* Small table */}
            <ellipse cx="192" cy="242" rx="12" ry="5" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1"/>
            <rect x="191" y="242" width="2" height="10" fill="#9ca3af"/>
            {/* Drink */}
            <rect x="187" y="233" width="10" height="11" rx="2" fill="#22d3ee" opacity="0.9"/>
            <line x1="189" y1="233" x2="186" y2="226" stroke="#6b7280" strokeWidth="1"/>
            {/* Footprints in sand */}
            {[[80,262],[88,255],[95,263],[103,255]].map(([fx,fy],i) => (
              <ellipse key={i} cx={fx} cy={fy} rx="4" ry="6" fill="#d97706" opacity="0.25" transform={`rotate(${i%2===0?15:-15} ${fx} ${fy})`}/>
            ))}
          </svg>
        </motion.div>

        {/* ── Frame border glow ── */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20 pointer-events-none" style={{ boxShadow: 'inset 0 0 40px rgba(255,255,255,0.05)' }}/>
      </motion.div>
    </div>
  );
}

import { motion } from 'motion/react';

// Animated SVG Pool with lanes, ripples and diving board
function PoolSVG() {
  return (
    <svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Sky/background */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="poolWallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2f8ff" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
        <clipPath id="poolClip">
          <rect x="20" y="60" width="280" height="85" rx="4" />
        </clipPath>
      </defs>

      {/* Pool body */}
      <rect x="20" y="60" width="280" height="85" rx="6" fill="url(#poolWallGrad)" stroke="#7dd3fc" strokeWidth="2"/>

      {/* Water fill */}
      <rect x="22" y="72" width="276" height="71" rx="3" fill="url(#waterGrad)" clipPath="url(#poolClip)"/>

      {/* Lane dividers */}
      {[105, 160, 215].map((x, i) => (
        <line key={i} x1={x} y1="72" x2={x} y2="143" stroke="#a5f3fc" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6"/>
      ))}

      {/* Pool bottom tiles */}
      {[0,1,2,3,4,5,6].map(col =>
        [0,1,2].map(row => (
          <rect key={`${col}-${row}`}
            x={22 + col * 40} y={118 + row * 10}
            width="38" height="9"
            fill="none" stroke="#a5f3fc" strokeWidth="0.5" opacity="0.4"
          />
        ))
      )}

      {/* Animated wave 1 */}
      <motion.path
        d="M22,88 Q72,78 122,88 Q172,98 222,88 Q272,78 298,88 L298,72 L22,72 Z"
        fill="#67e8f9" opacity="0.5"
        animate={{ d: [
          "M22,88 Q72,78 122,88 Q172,98 222,88 Q272,78 298,88 L298,72 L22,72 Z",
          "M22,82 Q72,92 122,82 Q172,72 222,82 Q272,92 298,82 L298,72 L22,72 Z",
          "M22,88 Q72,78 122,88 Q172,98 222,88 Q272,78 298,88 L298,72 L22,72 Z",
        ]}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        clipPath="url(#poolClip)"
      />

      {/* Animated wave 2 */}
      <motion.path
        d="M22,82 Q57,74 92,82 Q127,90 162,82 Q197,74 232,82 Q267,90 298,82 L298,72 L22,72 Z"
        fill="#22d3ee" opacity="0.4"
        animate={{ d: [
          "M22,82 Q57,74 92,82 Q127,90 162,82 Q197,74 232,82 Q267,90 298,82 L298,72 L22,72 Z",
          "M22,76 Q57,84 92,76 Q127,68 162,76 Q197,84 232,76 Q267,68 298,76 L298,72 L22,72 Z",
          "M22,82 Q57,74 92,82 Q127,90 162,82 Q197,74 232,82 Q267,90 298,82 L298,72 L22,72 Z",
        ]}}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        clipPath="url(#poolClip)"
      />

      {/* Bubble ripples */}
      {[60, 130, 200, 270].map((cx, i) => (
        <motion.circle key={i} cx={cx} cy={110}
          r="0" fill="none" stroke="#e0f7ff" strokeWidth="1.5"
          animate={{ r: [0, 18, 0], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
          clipPath="url(#poolClip)"
        />
      ))}

      {/* Pool deck left */}
      <rect x="0" y="56" width="22" height="93" rx="2" fill="#f1f5f9"/>
      <rect x="0" y="56" width="22" height="93" rx="2" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
      {/* Pool deck right */}
      <rect x="298" y="56" width="22" height="93" rx="2" fill="#f1f5f9"/>
      <rect x="298" y="56" width="22" height="93" rx="2" fill="none" stroke="#cbd5e1" strokeWidth="1"/>

      {/* Diving board */}
      <rect x="255" y="42" width="50" height="6" rx="3" fill="#60a5fa"/>
      <rect x="286" y="48" width="8" height="14" rx="2" fill="#93c5fd"/>

      {/* Ladder left */}
      <rect x="28" y="55" width="3" height="15" rx="1" fill="#94a3b8"/>
      <rect x="35" y="55" width="3" height="15" rx="1" fill="#94a3b8"/>
      <rect x="28" y="61" width="10" height="2" rx="1" fill="#94a3b8"/>
      <rect x="28" y="67" width="10" height="2" rx="1" fill="#94a3b8"/>

      {/* Umbrella + chair near pool */}
      {/* Umbrella */}
      <path d="M50,45 Q70,30 90,45 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1"/>
      <line x1="70" y1="45" x2="70" y2="60" stroke="#92400e" strokeWidth="1.5"/>
      {/* Lounge chair */}
      <rect x="58" y="55" width="22" height="6" rx="2" fill="#fde68a" stroke="#f59e0b" strokeWidth="1"/>
      <rect x="58" y="61" width="18" height="4" rx="1" fill="#fde68a" stroke="#f59e0b" strokeWidth="1"/>
      {/* Person on chair */}
      <ellipse cx="72" cy="54" rx="5" ry="5" fill="#fcd34d"/>
      <rect x="65" y="58" width="14" height="3" rx="1" fill="#fb923c"/>

      {/* Water depth markers */}
      <text x="30" y="145" fontSize="7" fill="#7dd3fc" opacity="0.9" fontFamily="monospace">1.2m</text>
      <text x="270" y="145" fontSize="7" fill="#7dd3fc" opacity="0.9" fontFamily="monospace">2.0m</text>

      {/* Sun rays top right */}
      {[0,30,60,90,120,150].map((deg, i) => (
        <motion.line key={i}
          x1="310" y1="10"
          x2={310 + Math.cos((deg * Math.PI) / 180) * 20}
          y2={10 + Math.sin((deg * Math.PI) / 180) * 20}
          stroke="#fde68a" strokeWidth="2" strokeLinecap="round" opacity="0.7"
          animate={{ opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      <circle cx="310" cy="10" r="7" fill="#fde047" opacity="0.9"/>
    </svg>
  );
}

export function PoolSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="w-full max-w-5xl mx-auto px-4"
    >
      {/* Section divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-200" />
        <div className="flex items-center gap-2 text-cyan-700 font-bold text-sm uppercase tracking-widest">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12c1.5-3 4-4.5 6-4.5s4.5 1.5 6 1.5 4.5-1.5 6-1.5"/>
            <path d="M2 17c1.5-3 4-4.5 6-4.5s4.5 1.5 6 1.5 4.5-1.5 6-1.5"/>
          </svg>
          Area Piscina
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-200" />
      </div>

      {/* Main card */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-cyan-200 shadow-xl bg-white">
        {/* SVG pool illustration */}
        <div className="relative h-44 sm:h-52 w-full bg-gradient-to-b from-sky-50 to-cyan-50 overflow-hidden">
          <PoolSVG />
        </div>

        {/* Info panel */}
        <div className="relative bg-white px-6 py-5">
          {/* Decorative wave top */}
          <div className="absolute -top-5 left-0 right-0 overflow-hidden h-6">
            <svg viewBox="0 0 400 24" className="w-full h-full fill-white" preserveAspectRatio="none">
              <path d="M0,12 Q50,0 100,12 Q150,24 200,12 Q250,0 300,12 Q350,24 400,12 L400,24 L0,24 Z"/>
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-cyan-900 flex items-center gap-2">
                🏊 Area Piscina
                <span className="text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full ml-1">
                  Solo in cassa
                </span>
              </h3>
              <p className="text-stone-500 text-sm mt-1 leading-relaxed max-w-md">
                Ombrellone e lettino inclusi · Docce e servizi disponibili
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                  </svg>
                  <span>Giornata intera — <strong>€20</strong> <span className="font-normal text-stone-400 text-xs">(9:00–19:00)</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-2 rounded-xl">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                  </svg>
                  <span>Mezza giornata — <strong>€12</strong> <span className="font-normal text-stone-400 text-xs">(9:00–14:00 o 14:00–19:00)</span></span>
                </div>
              </div>
            </div>

            {/* Info box */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="shrink-0 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl px-5 py-4 text-center shadow-sm"
            >
              <div className="text-2xl mb-1">🏖️</div>
              <p className="text-sm font-black text-amber-800 leading-tight">
                Per la piscina<br/>niente prenotazioni online
              </p>
              <p className="text-xs text-amber-600 mt-1 font-medium">
                Chiedere direttamente in cassa
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

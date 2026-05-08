import { motion } from 'motion/react';

function PoolSVG() {
  return (
    <svg viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="poolSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#bfdbfe"/>
          <stop offset="60%"  stopColor="#e0f2fe"/>
          <stop offset="100%" stopColor="#bae6fd"/>
        </linearGradient>
        <linearGradient id="poolWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#22d3ee"/>
          <stop offset="50%"  stopColor="#0891b2"/>
          <stop offset="100%" stopColor="#065f92"/>
        </linearGradient>
        <linearGradient id="deckGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f8fafc"/>
          <stop offset="100%" stopColor="#e2e8f0"/>
        </linearGradient>
        <radialGradient id="sunRefl" cx="50%" cy="0%" r="70%">
          <stop offset="0%"   stopColor="#fde047" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#fde047" stopOpacity="0"/>
        </radialGradient>
        <clipPath id="waterClip">
          <path d="M8,95 Q40,88 180,92 Q300,96 352,88 L352,175 L8,175 Z"/>
        </clipPath>
      </defs>

      {/* Sky */}
      <rect width="360" height="180" fill="url(#poolSky)"/>

      {/* Sun in sky */}
      <circle cx="290" cy="32" r="22" fill="#fde047" opacity="0.85"/>
      <motion.circle cx="290" cy="32" r="30" fill="#fbbf24" opacity="0"
        animate={{ r:[28,38,28], opacity:[0,0.25,0] }}
        transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}
      />

      {/* Palm tree left */}
      {/* trunk */}
      <path d="M28,175 Q30,140 38,110 Q42,95 44,85" stroke="#92400e" strokeWidth="5" fill="none" strokeLinecap="round"/>
      {/* fronds */}
      <path d="M44,85 Q70,72 82,55" stroke="#16a34a" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M44,85 Q68,82 85,74" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M44,85 Q62,95 75,112" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M44,85 Q22,76 8,68" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M44,85 Q24,90 8,95" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* coconuts */}
      <circle cx="52" cy="88" r="4" fill="#78350f"/>
      <circle cx="46" cy="92" r="3.5" fill="#92400e"/>

      {/* Pool surround / deck */}
      <path d="M0,88 Q40,82 180,86 Q300,90 360,82 L360,100 Q300,108 180,104 Q40,100 0,108 Z"
        fill="url(#deckGrad)" stroke="#cbd5e1" strokeWidth="1"/>
      {/* Tile edge stripes */}
      <path d="M0,100 Q40,108 180,104 Q300,100 360,108" stroke="#7dd3fc" strokeWidth="2" fill="none" strokeDasharray="8 4" opacity="0.5"/>

      {/* Water body */}
      <path d="M8,95 Q40,88 180,92 Q300,96 352,88 L352,175 L8,175 Z"
        fill="url(#poolWater)"/>

      {/* Underwater light rays */}
      {[85,140,200,260,310].map((x,i)=>(
        <motion.path key={i}
          d={`M${x},92 L${x-12},175 L${x+12},175 Z`}
          fill="#67e8f9" opacity="0"
          animate={{ opacity:[0,0.14,0] }}
          transition={{ duration:2.5, repeat:Infinity, delay:i*0.5, ease:"easeInOut" }}
          clipPath="url(#waterClip)"
        />
      ))}

      {/* Surface waves */}
      <motion.path
        d="M8,95 Q70,88 140,95 Q210,102 280,95 Q315,91 352,95"
        fill="none" stroke="#a5f3fc" strokeWidth="2.5" opacity="0.7"
        animate={{ d:[
          "M8,95 Q70,88 140,95 Q210,102 280,95 Q315,91 352,95",
          "M8,91 Q70,98 140,91 Q210,84 280,91 Q315,95 352,91",
          "M8,95 Q70,88 140,95 Q210,102 280,95 Q315,91 352,95",
        ]}}
        transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}
      />
      <motion.path
        d="M8,98 Q90,94 160,98 Q230,102 300,98 Q330,96 352,98"
        fill="none" stroke="white" strokeWidth="1.5" opacity="0.4"
        animate={{ d:[
          "M8,98 Q90,94 160,98 Q230,102 300,98 Q330,96 352,98",
          "M8,101 Q90,97 160,101 Q230,105 300,101 Q330,99 352,101",
          "M8,98 Q90,94 160,98 Q230,102 300,98 Q330,96 352,98",
        ]}}
        transition={{ duration:2.2, repeat:Infinity, ease:"easeInOut", delay:0.8 }}
      />

      {/* Sun reflection on water */}
      <motion.ellipse cx="290" cy="94" rx="30" ry="8" fill="url(#sunRefl)"
        animate={{ rx:[28,34,28], opacity:[0.6,1,0.6] }}
        transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}
      />

      {/* Diving board — curved organic */}
      <path d="M256,60 Q288,58 308,52" stroke="#60a5fa" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M256,60 L256,95" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round"/>

      {/* Person on board — about to dive */}
      <circle cx="310" cy="46" r="7" fill="#fcd34d"/>
      <path d="M303,53 Q310,60 318,53" stroke="#fb923c" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* arms up */}
      <path d="M305,57 Q300,50 295,46" stroke="#fcd34d" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M315,57 Q320,50 325,46" stroke="#fcd34d" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

      {/* Bubbles */}
      {[[100,140],[165,155],[230,138],[290,152]].map(([cx,cy],i)=>(
        <motion.circle key={i} cx={cx} cy={cy} r="3" fill="none" stroke="#a5f3fc" strokeWidth="1.5"
          animate={{ cy:[cy,cy-25,cy], r:[3,5,3], opacity:[0.8,0,0.8] }}
          transition={{ duration:2+i*0.4, repeat:Infinity, delay:i*0.6, ease:"easeOut" }}
          clipPath="url(#waterClip)"
        />
      ))}

      {/* Lounger on deck right */}
      <path d="M290,85 Q308,80 325,82 Q325,88 308,88 Z" fill="#fde68a" stroke="#f59e0b" strokeWidth="1"/>
      <circle cx="322" cy="80" r="5" fill="#fcd34d"/>
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
        <div className="relative h-12 w-full bg-gradient-to-b from-sky-50 to-cyan-50 overflow-hidden">
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

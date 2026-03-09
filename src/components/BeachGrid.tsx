import { clsx } from 'clsx';
import { Umbrella } from '../types';
import { motion } from 'motion/react';
import { Umbrella as LifeguardUmbrella, LifeBuoy } from 'lucide-react';

const BeachUmbrellaIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 12v10" />
    <path d="M12 2a10 10 0 0 0-10 10h20a10 10 0 0 0-10-10z" />
    <path d="M12 2L8 12" />
    <path d="M12 2l4 10" />
  </svg>
);

const SunbedIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 14h12l4-6" />
    <path d="M5 14v4" />
    <path d="M13 14v4" />
    <path d="M18 8l2 6" />
  </svg>
);

interface BeachGridProps {
  umbrellas: Umbrella[];
  onToggleSelect: (umbrella: Umbrella) => void;
  selectedUmbrellas: Umbrella[];
}

export function BeachGrid({ umbrellas, onToggleSelect, selectedUmbrellas }: BeachGridProps) {
  // Group by row
  const rows = [1, 2, 3, 4].map(r => umbrellas.filter(u => u.row === r).sort((a, b) => a.number - b.number));
  const rivaZones = umbrellas.filter(u => u.row === 0 && u.isZone).sort((a, b) => a.number - b.number);

  const renderItem = (umbrella: Umbrella) => {
    const isSelected = selectedUmbrellas.some(u => u.row === umbrella.row && u.number === umbrella.number);
    const isRivaZone = umbrella.row === 0 && umbrella.isZone;

    // Calculate display number based on rules
    let displayNumber = umbrella.number * 10 + umbrella.row;

    if (isRivaZone) {
      return (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: umbrella.number * 0.1 }}
          whileHover={!umbrella.isBooked ? { scale: 1.05, y: -5 } : {}}
          whileTap={!umbrella.isBooked ? { scale: 0.95 } : {}}
          key={`zone-${umbrella.zoneId}`}
          onClick={() => {
            onToggleSelect(umbrella);
            setTimeout(() => {
              document.getElementById('cart-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className={clsx(
            "flex flex-col items-center justify-center p-2 transition-colors duration-200 shadow-sm relative group shrink-0 rounded-xl border-2 w-full max-w-[200px] md:max-w-[240px] lg:flex-1 h-20 md:h-24",
            umbrella.isBooked
              ? umbrella.isSubscription 
                  ? "bg-blue-500 text-white cursor-not-allowed border-blue-600" 
                  : "bg-red-50 text-red-500 cursor-not-allowed border-red-200"
              : isSelected
                ? "bg-emerald-700 text-white shadow-md z-10 border-emerald-800"
                : "bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-200"
          )}
          disabled={umbrella.isBooked}
        >
          <div className="flex flex-col items-center gap-1">
            <SunbedIcon className={clsx("w-6 h-6 md:w-8 md:h-8", isSelected || umbrella.isSubscription ? "text-white" : umbrella.isBooked ? "text-red-400" : "text-emerald-600")} />
            <span className={clsx("font-bold text-xs md:text-sm tracking-wide leading-none", isSelected || umbrella.isSubscription ? "text-white" : "text-stone-800")}>
              {umbrella.zoneName}
            </span>
            {umbrella.isBooked ? (
              <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                Esaurito
              </span>
            ) : (
              <span className={clsx(
                "mt-1 px-2 py-0.5 rounded-full text-[11px] font-black leading-none",
                isSelected ? "bg-white/30 text-white" : "bg-emerald-100 text-emerald-800"
              )}>
                🏖️ {umbrella.availableQuantity} lettini liberi
              </span>
            )}
          </div>
        </motion.button>
      );
    }

    return (
      <motion.button
        initial={{ opacity: 0, scale: 0, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          type: "spring", stiffness: 260, damping: 20, 
          delay: (umbrella.row * 0.15) + (Math.abs(16 - umbrella.number) * 0.02) 
        }}
        whileHover={!umbrella.isBooked ? { scale: 1.15, y: -5 } : {}}
        whileTap={!umbrella.isBooked ? { scale: 0.9 } : {}}
        key={`${umbrella.row}-${umbrella.number}`}
        onClick={() => {
          onToggleSelect(umbrella);
          setTimeout(() => {
            document.getElementById('cart-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        className={clsx(
          "flex flex-col items-center justify-center transition-colors duration-200 shadow-sm relative group shrink-0",
          "w-8 h-8 md:w-10 md:h-10 rounded-full",
          umbrella.isBooked
            ? umbrella.isSubscription 
                ? "bg-blue-500 text-white cursor-not-allowed border border-blue-600"
                : "bg-red-50 text-red-500 cursor-not-allowed border border-red-200"
            : isSelected
              ? "bg-emerald-700 text-white shadow-md z-10"
              : "bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200"
        )}
        disabled={umbrella.isBooked}
        title={umbrella.isBooked ? (umbrella.isSubscription ? "Abbonato" : "Prenotato") : `Ombrellone ${displayNumber} (Fila ${umbrella.row})`}
      >
        <BeachUmbrellaIcon className={clsx("w-4 h-4 md:w-5 md:h-5", isSelected || umbrella.isSubscription ? "text-white" : umbrella.isBooked ? "text-red-400" : "text-emerald-600")} />
        <span className={clsx("text-[8px] md:text-[9px] font-bold absolute -bottom-4", isSelected || umbrella.isSubscription ? "text-blue-800" : "text-stone-600")}>
          {displayNumber}
        </span>
      </motion.button>
    );
  };

  return (
    <div 
      className="w-full bg-stone-100 rounded-2xl shadow-inner border border-stone-200 overflow-x-auto pb-4 relative"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Inner container with w-max to naturally define the scrolling width without forcing a strict min-width */}
      <div className="w-max min-w-full mx-auto flex flex-col items-center space-y-4 py-4 px-4 md:px-8">
        {/* The Sea */}
        <div className="w-full h-12 md:h-16 bg-gradient-to-b from-blue-500 to-blue-300 rounded-xl flex items-center justify-center text-white font-bold tracking-widest uppercase mb-2 shadow-md text-sm md:text-base relative overflow-hidden z-0">
          
          {/* Animated Shore Waves (Onde che sbattono sulla riva) */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-6 bg-blue-100/40 rounded-t-full blur-[2px]"
            animate={{ y: [8, -3, 8], scaleY: [0.5, 1.2, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-[-10px] left-10 right-10 h-6 bg-white/60 rounded-t-full blur-[4px]"
            animate={{ y: [8, -5, 8], scaleY: [0.5, 1.5, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div 
            className="absolute bottom-[-5px] left-32 right-32 h-4 bg-white/80 rounded-t-full blur-[2px]"
            animate={{ y: [12, -8, 12], scaleY: [0.5, 2, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          />
          
          <span className="relative z-10 drop-shadow-md">Il Mare</span>
        </div>

        {/* Riva (Shore) ZONES */}
        <div className="flex flex-col items-center w-full">
          <div className="text-xs font-bold text-stone-600 bg-stone-200/50 px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest border border-stone-300/50 shadow-sm flex items-center gap-2">
            <SunbedIcon className="w-4 h-4 text-stone-500" />
            Riva (Lettini)
          </div>

          <div className="flex justify-between items-center w-full gap-4 px-4 md:px-8">
            {/* Zone A */}
            {rivaZones.length > 0 && renderItem(rivaZones[0])}

            {/* Lifeguard 1 */}
            <div className="flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl border-2 border-red-500 text-red-600 shadow-md relative shrink-0" title="Postazione Bagnino 1 con Pattino">
              <LifeBuoy className="w-6 h-6" />
              <div className="absolute -top-4 w-6 h-6 md:w-8 md:h-8 bg-red-600 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                <BeachUmbrellaIcon className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Zone B */}
            {rivaZones.length > 1 && renderItem(rivaZones[1])}

            {/* Lifeguard 2 */}
            <div className="flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl border-2 border-red-500 text-red-600 shadow-md relative shrink-0" title="Postazione Bagnino 2 con Pattino">
              <LifeBuoy className="w-6 h-6" />
              <div className="absolute -top-4 w-6 h-6 md:w-8 md:h-8 bg-red-600 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                <BeachUmbrellaIcon className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Zone C */}
            {rivaZones.length > 2 && renderItem(rivaZones[2])}
          </div>
        </div>

        {/* Umbrella Rows */}
        {rows.map((row, i) => (
          <div key={i} className="flex flex-col items-center w-full relative pt-5">
            <div className="text-[10px] md:text-xs font-bold text-stone-600 bg-stone-200/50 px-3 py-1 rounded-full mb-3 uppercase tracking-wider border border-stone-300/50 shadow-sm relative z-10 bg-stone-100">
              Fila {i + 1}
            </div>

            {/* Visual separator line for the row */}
            <div className="absolute top-7 left-4 right-4 h-px bg-stone-300/50 -z-0"></div>

            <div className="flex items-center justify-center gap-2 md:gap-4 w-full px-1 md:px-2">
              {/* Left side (1-15) */}
              <div className="flex items-center gap-1.5 md:gap-3 flex-1 justify-end">
                {row.filter(u => u.number <= 15).map(renderItem)}
              </div>

              {/* Central Walkway */}
              <div className="w-8 md:w-12 flex items-center justify-center relative shrink-0 h-10">
                <div className="w-6 md:w-8 absolute inset-y-[-10px] bg-stone-200/50 rounded-md border-x border-stone-300/50 flex items-center justify-center text-[7px] md:text-[8px] text-stone-400 font-bold uppercase tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>
                  Passaggio
                </div>
              </div>

              {/* Right side (16-31) */}
              <div className="flex items-center gap-1.5 md:gap-3 flex-1 justify-start">
                {row.filter(u => u.number > 15).map(renderItem)}
              </div>
            </div>
          </div>
        ))}

        {/* The Beach / Entrance */}
        <div className="w-full h-8 md:h-10 bg-stone-200/80 rounded-xl border border-stone-300/50 flex flex-col items-center justify-center text-stone-600 text-xs font-bold tracking-widest uppercase mt-4 relative shadow-sm">
          <div className="absolute -top-4 w-12 h-4 bg-stone-200/80 border-x border-t border-stone-300/50 rounded-t-lg"></div>
          Ingresso Stabilimento
        </div>
      </div>
    </div>
  );
}

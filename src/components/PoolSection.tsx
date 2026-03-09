import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, Users, Plus, Minus, ShoppingCart, Info } from 'lucide-react';
import { POOL } from '../constants';
import { clsx } from 'clsx';
import { differenceInDays, parseISO } from 'date-fns';

interface PoolSectionProps {
  startDate: string;
  endDate: string;
  availableSpots: number;   // POOL.maxCapacity - already booked
  onAddToCart: (people: number) => void;
  alreadyInCart: boolean;
  peopleInCart: number;
}

export function PoolSection({ startDate, endDate, availableSpots, onAddToCart, alreadyInCart, peopleInCart }: PoolSectionProps) {
  const [people, setPeople] = useState(1);
  const [showInfo, setShowInfo] = useState(false);

  const days = Math.max(1, differenceInDays(parseISO(endDate), parseISO(startDate)) + 1);
  const total = people * POOL.pricePerPerson * days;
  const isFull = availableSpots <= 0;
  const maxSelectable = Math.min(availableSpots, 20); // max 20 per booking

  const handleAdd = () => {
    if (people < maxSelectable) setPeople(p => p + 1);
  };
  const handleRemove = () => {
    if (people > 1) setPeople(p => p - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full max-w-5xl mx-auto px-4"
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-200" />
        <div className="flex items-center gap-2 text-cyan-700 font-bold text-sm uppercase tracking-widest">
          <Waves className="w-4 h-4" />
          Area Piscina
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-200" />
      </div>

      <div className={clsx(
        "rounded-3xl overflow-hidden shadow-lg border-2 transition-all",
        isFull ? "border-red-200" : alreadyInCart ? "border-cyan-500 ring-2 ring-cyan-300/50" : "border-cyan-200 hover:border-cyan-400"
      )}>
        {/* Animated pool visual */}
        <div className="relative bg-gradient-to-br from-cyan-600 via-blue-500 to-cyan-700 h-36 overflow-hidden">
          {/* Water ripple animations */}
          {[...Array(4)].map((_, i) => (
            <motion.div key={i}
              className="absolute rounded-full border-2 border-white/20"
              style={{ width: 60 + i * 80, height: 60 + i * 80, top: '50%', left: '50%', x: '-50%', y: '-50%' }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3, delay: i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* Wave bottom */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-10 bg-white/10 rounded-t-[60%]"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-[-10%] right-[-10%] h-8 bg-white/15 rounded-t-[60%]"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Waves className="w-12 h-12 mb-1 drop-shadow-lg" />
            </motion.div>
            <h3 className="font-black text-2xl tracking-tight drop-shadow-md">Area Piscina</h3>
            <p className="text-cyan-100 text-xs font-medium mt-0.5">Ombrellone + lettino inclusi</p>
          </div>

          {/* Availability badge */}
          <div className="absolute top-3 right-3">
            <span className={clsx(
              "text-xs font-bold px-3 py-1 rounded-full shadow-md",
              isFull ? "bg-red-500 text-white" : "bg-white/90 text-cyan-800"
            )}>
              {isFull ? "Esaurita" : `${availableSpots} posti liberi`}
            </span>
          </div>
        </div>

        {/* Bottom panel */}
        <div className="bg-white p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

            {/* Left: Info + price */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-cyan-700">€{POOL.pricePerPerson}</span>
                <span className="text-sm text-stone-400 font-medium">/ persona / giorno</span>
                <button
                  type="button"
                  onClick={() => setShowInfo(v => !v)}
                  className="ml-1 text-stone-400 hover:text-cyan-600 transition-colors"
                  title="Cosa è incluso?"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-stone-500 bg-cyan-50 border border-cyan-100 rounded-xl px-3 py-2 space-y-1"
                  >
                    <p>✅ Accesso piscina per l'intera giornata</p>
                    <p>✅ Ombrellone in area piscina incluso</p>
                    <p>✅ Lettino incluso</p>
                    <p>✅ Docce e servizi disponibili</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {days > 1 && (
                <p className="text-xs text-stone-400">
                  {people} pers. × {days} giorni = <strong className="text-stone-700">€{total}</strong>
                </p>
              )}
            </div>

            {/* Right: Counter + Add button */}
            {!isFull ? (
              <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                {/* People counter */}
                <div className="flex items-center gap-3 bg-stone-100 rounded-xl px-2 py-1">
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={people <= 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:bg-white hover:shadow-sm disabled:opacity-40 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1.5 min-w-[64px] justify-center">
                    <Users className="w-4 h-4 text-cyan-600" />
                    <motion.span
                      key={people}
                      initial={{ scale: 1.3 }} animate={{ scale: 1 }}
                      className="font-black text-lg text-stone-800 w-5 text-center"
                    >
                      {people}
                    </motion.span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={people >= maxSelectable}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:bg-white hover:shadow-sm disabled:opacity-40 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to cart button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => onAddToCart(people)}
                  className={clsx(
                    "w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2",
                    alreadyInCart
                      ? "bg-cyan-700 hover:bg-cyan-800 text-white"
                      : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-cyan-400/30"
                  )}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {alreadyInCart ? `Aggiorna (${peopleInCart}→${people} pers.)` : `Aggiungi al carrello · €${total}`}
                </motion.button>
              </div>
            ) : (
              <div className="text-center py-2 px-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-semibold">
                🏊 Piscina esaurita per queste date
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

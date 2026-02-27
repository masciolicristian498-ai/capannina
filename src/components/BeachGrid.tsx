import { clsx } from 'clsx';
import { Umbrella } from '../types';
import { Umbrella as UmbrellaIcon, LifeBuoy, RectangleHorizontal } from 'lucide-react';

interface BeachGridProps {
  umbrellas: Umbrella[];
  onToggleSelect: (umbrella: Umbrella) => void;
  selectedUmbrellas: Umbrella[];
}

export function BeachGrid({ umbrellas, onToggleSelect, selectedUmbrellas }: BeachGridProps) {
  // Group by row
  const rows = [1, 2, 3, 4].map(r => umbrellas.filter(u => u.row === r).sort((a, b) => a.number - b.number));
  const riva = umbrellas.filter(u => u.row === 0).sort((a, b) => a.number - b.number);

  const renderItem = (umbrella: Umbrella) => {
    const isSelected = selectedUmbrellas.some(u => u.row === umbrella.row && u.number === umbrella.number);
    const isRiva = umbrella.row === 0;
    
    // Calculate display number based on rules
    let displayNumber = umbrella.number;
    if (!isRiva) {
      // 11, 12, 13... for row 1
      // 21, 22, 23... for row 2
      displayNumber = umbrella.number * 10 + umbrella.row;
    }
    
    return (
      <button
        key={`${umbrella.row}-${umbrella.number}`}
        onClick={() => {
          onToggleSelect(umbrella);
          setTimeout(() => {
            document.getElementById('cart-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        className={clsx(
          "flex flex-col items-center justify-center transition-all duration-200 shadow-sm relative group",
          isRiva ? "w-8 h-10 rounded-md" : "w-10 h-10 rounded-full",
          umbrella.isBooked 
            ? "bg-red-50 text-red-500 cursor-not-allowed border border-red-200" 
            : isSelected
              ? "bg-emerald-700 text-white shadow-md scale-110 z-10"
              : "bg-white text-emerald-600 hover:bg-emerald-50 hover:scale-105 border border-emerald-200"
        )}
        disabled={umbrella.isBooked}
        title={umbrella.isBooked ? "Prenotato" : isRiva ? `Lettino Riva ${displayNumber}` : `Ombrellone ${displayNumber} (Fila ${umbrella.row})`}
      >
        {isRiva ? (
          <RectangleHorizontal className={clsx("w-5 h-5", isSelected ? "text-white" : umbrella.isBooked ? "text-red-400" : "text-emerald-600")} />
        ) : (
          <UmbrellaIcon className={clsx("w-5 h-5", isSelected ? "text-white" : umbrella.isBooked ? "text-red-400" : "text-emerald-600")} />
        )}
        <span className={clsx("text-[10px] font-bold absolute -bottom-4", isSelected ? "text-emerald-800" : "text-stone-600")}>
          {displayNumber}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full overflow-x-auto py-8 px-4 bg-stone-100 rounded-2xl shadow-inner border border-stone-200">
      <div className="min-w-[1200px] flex flex-col items-center space-y-8">
        {/* The Sea */}
        <div className="w-full h-16 bg-gradient-to-b from-blue-500 to-blue-300 rounded-t-xl flex items-center justify-center text-white font-semibold tracking-widest uppercase mb-12 shadow-md">
          Il Mare
        </div>

        {/* Riva (Shore) */}
        <div className="flex flex-col items-center w-full mb-12">
          <div className="text-xs font-bold text-stone-500 mb-4 uppercase tracking-wider">Riva (Lettini)</div>
          <div className="flex justify-center items-center space-x-2 w-full">
            {/* Lettini 1-8 */}
            {riva.filter(u => u.number <= 8).map(renderItem)}

            {/* Lifeguard 1 (in front of 91) */}
            <div className="flex flex-col items-center justify-center w-12 h-12 bg-white rounded-lg border-2 border-red-500 text-red-600 shadow-md relative mx-2" title="Postazione Bagnino 1 con Pattino">
              <LifeBuoy className="w-6 h-6" />
              <div className="absolute -top-4 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                <UmbrellaIcon className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Lettini 9-15 */}
            {riva.filter(u => u.number > 8 && u.number <= 15).map(renderItem)}

            {/* Central Walkway Space */}
            <div className="w-16 h-full flex items-center justify-center">
              <div className="w-8 h-20 bg-stone-200/50 rounded-md border-x border-stone-300/50"></div>
            </div>

            {/* Lettini 16-17 */}
            {riva.filter(u => u.number > 15 && u.number <= 17).map(renderItem)}

            {/* Lifeguard 2 (in front of 181) */}
            <div className="flex flex-col items-center justify-center w-12 h-12 bg-white rounded-lg border-2 border-red-500 text-red-600 shadow-md relative mx-2" title="Postazione Bagnino 2 con Pattino">
              <LifeBuoy className="w-6 h-6" />
              <div className="absolute -top-4 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                <UmbrellaIcon className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Lettini 18-30 */}
            {riva.filter(u => u.number > 17).map(renderItem)}
          </div>
        </div>

        {/* Umbrella Rows */}
        {rows.map((row, i) => (
          <div key={i} className="flex flex-col items-center w-full relative">
            <div className="text-xs font-bold text-stone-500 mb-4 uppercase tracking-wider">Fila {i + 1}</div>
            <div className="flex justify-center items-center space-x-3 w-full">
              {/* Left side (1-15) */}
              {row.filter(u => u.number <= 15).map(renderItem)}
              
              {/* Central Walkway */}
              <div className="w-16 h-full flex items-center justify-center relative">
                <div className="absolute inset-y-[-20px] w-12 bg-stone-200/50 rounded-md border-x border-stone-300/50"></div>
              </div>
              
              {/* Right side (16-31) */}
              {row.filter(u => u.number > 15).map(renderItem)}
            </div>
          </div>
        ))}
        
        {/* The Beach / Entrance */}
        <div className="w-full h-12 bg-stone-200/50 rounded-b-xl flex items-center justify-center text-stone-500 text-xs font-semibold tracking-widest uppercase mt-12 relative">
          <div className="absolute -top-12 w-12 h-12 bg-stone-200/50 border-x border-stone-300/50"></div>
          Ingresso Stabilimento
        </div>
      </div>
    </div>
  );
}

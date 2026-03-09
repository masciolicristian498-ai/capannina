import React from 'react';

export function BeachSkeleton() {
  return (
    <div className="w-full bg-stone-100 rounded-2xl shadow-inner border border-stone-200 overflow-hidden pb-4">
      <div className="flex flex-col items-center space-y-4 py-4 px-2 md:px-6">
        {/* The Sea Skeleton */}
        <div className="w-full h-12 md:h-16 bg-stone-200 rounded-xl mb-2 flex items-center justify-center animate-pulse">
          <div className="w-24 h-4 bg-stone-300 rounded-full"></div>
        </div>

        {/* Row 0 / Riva */}
        <div className="w-full max-w-4xl flex justify-around mb-6 mt-4">
          {[1, 2, 3].map((zone) => (
            <div key={`zone-${zone}`} className="flex flex-col items-center space-y-2 animate-pulse w-32 border border-stone-200 bg-stone-50 p-3 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] border-dashed">
              <div className="w-16 h-3 bg-stone-300 rounded-full mb-1"></div>
              <div className="w-10 h-10 bg-stone-200 rounded-full"></div>
              <div className="w-12 h-2 bg-stone-300 rounded-full mt-2"></div>
            </div>
          ))}
        </div>

        {/* Rows 1 to 5 */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={`row-${row}`} className="flex items-center space-x-2 md:space-x-4 mb-2 animate-pulse">
            <div className="w-8 text-center">
              <div className="w-4 h-4 mx-auto bg-stone-200 rounded-full"></div>
            </div>
            
            <div className="flex space-x-2 md:space-x-4">
               {/* 10 umbrellas per row */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div key={`umbrella-${row}-${num}`} className="w-8 h-8 md:w-10 md:h-10 bg-stone-200 rounded-full flex flex-col items-center justify-center relative">
                   {/* Stick base */}
                   <div className="absolute -bottom-2 w-1 h-3 bg-stone-300"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

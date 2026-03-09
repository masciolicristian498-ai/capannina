import React, { useMemo } from 'react';
import { Booking } from '../types';
import { Printer } from 'lucide-react';

interface RivaPrintListProps {
  bookings: Booking[];
  date: string;
}

export function RivaPrintList({ bookings, date }: RivaPrintListProps) {
  // Filter bookings to only those in row_number 0 (Riva) and matching the date
  // Since the parent already filters by active date filter, we just need to filter by row 0
  const rivaBookings = useMemo(() => {
    return bookings.filter(b => b.row_number === 0);
  }, [bookings]);

  // Group by Zone (1: Zona A, 2: Zona B, 3: Zona C)
  const zones = useMemo(() => {
    const grouped = {
      'Zona A': [] as any[],
      'Zona B': [] as any[],
      'Zona C': [] as any[],
    };

    rivaBookings.forEach(b => {
      // Calculate total lettini safely
      let numLettini = b.quantity || 1; 
      if (b.services && b.services.length > 0) {
        const lettiniService = b.services.find(s => s.type === 'lettino' || s.service_type === 'lettino');
        if (lettiniService) numLettini = lettiniService.quantity;
      }

      const item = {
        name: b.user_name,
        lettini: numLettini,
        status: b.checked_in ? 'Arrivato' : 'Da Arrivare',
        paid: b.is_paid
      };

      if (b.umbrella_number === 1) grouped['Zona A'].push(item);
      else if (b.umbrella_number === 2) grouped['Zona B'].push(item);
      else if (b.umbrella_number === 3) grouped['Zona C'].push(item);
      else grouped['Zona A'].push(item); // Fallback
    });

    return grouped;
  }, [rivaBookings]);

  if (rivaBookings.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500 bg-white rounded-2xl border border-stone-200">
        Nessuna prenotazione in Area Riva per la data selezionata.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      {/* Print Controls (Hidden when actually printing) */}
      <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex justify-between items-center no-print">
        <div>
          <h3 className="text-lg font-bold text-emerald-900">Distinta Bagnini - Area Riva</h3>
          <p className="text-emerald-700 text-sm">Pronta per essere stampata o consultata dai bagnini per la preparazione lettini.</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Printer className="w-5 h-5 mr-2" />
          Stampa Distinta
        </button>
      </div>

      {/* Printable Area */}
      <div id="riva-printable-area" className="p-8 bg-white">
        <div className="text-center mb-8 border-b-2 border-stone-800 pb-4">
          <h1 className="text-3xl font-black uppercase text-stone-900 tracking-wider">La Capannina - Area Riva</h1>
          <p className="text-xl font-bold text-stone-600 mt-2">
            Data: {date ? new Date(date).toLocaleDateString('it-IT') : 'Tutte le date'}
          </p>
        </div>

        <div className="space-y-10">
          {Object.entries(zones).map(([zoneName, customersData]) => {
            const customers = customersData as any[];
            if (customers.length === 0) return null;
            return (
              <div key={zoneName} className="break-inside-avoid">
                <h2 className="text-2xl font-bold bg-stone-100 py-2 px-4 border-l-4 border-stone-800 mb-4">{zoneName}</h2>
                <table className="w-full text-left border-collapse border border-stone-300">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="border border-stone-300 px-4 py-3 font-bold w-12 text-center text-stone-400">#</th>
                      <th className="border border-stone-300 px-4 py-3 font-bold">Cliente (Solo Lettini)</th>
                      <th className="border border-stone-300 px-4 py-3 font-bold w-32 text-center text-emerald-800">Q.tà Lettini</th>
                      <th className="border border-stone-300 px-4 py-3 font-bold w-48 no-print">Note Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c, idx) => (
                      <tr key={idx} className="hover:bg-stone-50 transition-colors">
                        <td className="border border-stone-300 px-4 py-3 text-center font-bold text-stone-400">{idx + 1}</td>
                        <td className="border border-stone-300 px-4 py-3 font-medium text-lg capitalize">{c.name}</td>
                        <td className="border border-stone-300 px-4 py-3 text-center font-black text-2xl text-emerald-700">{c.lettini}</td>
                        <td className="border border-stone-300 px-4 py-3 text-xs text-stone-500 no-print">
                           {c.paid ? 'Pagato' : 'Da pagare'} • {c.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center text-sm text-stone-400 font-medium">
          Generato automaticamente da La Capannina Gestione
        </div>
      </div>
    </div>
  );
}

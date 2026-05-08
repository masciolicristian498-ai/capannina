import React, { useMemo, useState } from 'react';
import { Booking } from '../types';
import { Printer, Share2, CheckCheck } from 'lucide-react';

interface RivaPrintListProps {
  bookings: Booking[];
  date: string;
}

export function RivaPrintList({ bookings, date }: RivaPrintListProps) {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    const content = document.getElementById('riva-printable-area')?.innerHTML;
    if (!content) return;
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8" />
        <title>Distinta Riva - La Capannina</title>
        <style>
          * { box-sizing: border-box !important; margin: 0 !important; padding: 0 !important; font-family: Arial, sans-serif !important; }
          body { padding: 10px !important; color: #111 !important; font-size: 10px !important; line-height: 1.3 !important; }
          h1 { font-size: 11px !important; font-weight: 900 !important; text-transform: uppercase !important; letter-spacing: 0.05em !important; margin-bottom: 2px !important; display: block !important; }
          h2 { font-size: 9px !important; font-weight: 700 !important; padding: 2px 8px !important; background: #f3f4f6 !important; border-left: 3px solid #111 !important; margin-bottom: 4px !important; margin-top: 8px !important; display: block !important; }
          p  { font-size: 8px !important; }
          div { display: block !important; }
          table { width: 100% !important; border-collapse: collapse !important; margin-bottom: 4px !important; }
          th, td { border: 1px solid #d1d5db !important; padding: 2px 6px !important; text-align: left !important; font-size: 8px !important; line-height: 1.2 !important; }
          th { font-weight: 700 !important; background: #f9fafb !important; }
          .footer { margin-top: 8px !important; text-align: center !important; font-size: 7px !important; color: #9ca3af !important; }
          .no-print, button { display: none !important; }
          @media print {
            body { padding: 4px !important; }
            @page { margin: 6mm !important; size: A4 portrait !important; }
          }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  // Build a plain-text version of the list for sharing
  const buildShareText = () => {
    const dateLabel = date ? new Date(date).toLocaleDateString('it-IT') : 'data generica';
    let text = `🏖️ La Capannina – Distinta Riva\n📅 ${dateLabel}\n`;
    Object.entries(zones).forEach(([zoneName, customers]) => {
      const list = customers as any[];
      if (list.length === 0) return;
      text += `\n*${zoneName}*\n`;
      list.forEach((c, i) => {
        text += `${i + 1}. ${c.name} – ${c.lettini} lettino${c.lettini > 1 ? 'i' : ''}\n`;
      });
    });
    return text.trim();
  };

  const handleShare = async () => {
    const text = buildShareText();
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Distinta Riva – La Capannina', text });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

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
        const lettiniService = b.services.find(s => s.type === 'lettino');
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
          <p className="text-emerald-700 text-sm">Pronta per essere stampata o condivisa con i bagnini.</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {/* Share (WhatsApp / nativo mobile) */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold rounded-lg shadow-sm transition-colors text-sm"
          >
            {copied
              ? <><CheckCheck className="w-4 h-4 text-emerald-600" /> Copiato!</>
              : <><Share2 className="w-4 h-4" /> Condividi / WhatsApp</>}
          </button>
          {/* Print */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm"
          >
            <Printer className="w-4 h-4" />
            Stampa
          </button>
        </div>
      </div>

      {/* Printable Area */}
      <div id="riva-printable-area" className="p-4 sm:p-6 bg-white">
        <div className="text-center mb-4 border-b-2 border-stone-800 pb-2">
          <h1 className="text-xl sm:text-2xl font-black uppercase text-stone-900 tracking-wider">La Capannina - Area Riva</h1>
          <p className="text-sm sm:text-base font-bold text-stone-600 mt-1">
            Data: {date ? new Date(date).toLocaleDateString('it-IT') : 'Tutte le date'}
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(zones).map(([zoneName, customersData]) => {
            const customers = customersData as any[];
            if (customers.length === 0) return null;
            return (
              <div key={zoneName} className="break-inside-avoid">
                <h2 className="text-lg font-bold bg-stone-100 py-1.5 px-3 border-l-4 border-stone-800 mb-2">{zoneName}</h2>
                <table className="w-full text-left border-collapse border border-stone-300 text-sm">
                  <thead>
                    <tr className="bg-stone-50">
                      <th className="border border-stone-300 px-2 py-1.5 font-bold w-8 text-center text-stone-400">#</th>
                      <th className="border border-stone-300 px-2 py-1.5 font-bold">Cliente (Solo Lettini)</th>
                      <th className="border border-stone-300 px-2 py-1.5 font-bold w-24 text-center text-emerald-800">Q.tà Lettini</th>
                      <th className="border border-stone-300 px-2 py-1.5 font-bold w-32 no-print">Note Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c, idx) => (
                      <tr key={idx} className="hover:bg-stone-50 transition-colors">
                        <td className="border border-stone-300 px-2 py-1.5 text-center font-bold text-stone-400">{idx + 1}</td>
                        <td className="border border-stone-300 px-2 py-1.5 font-medium capitalize">{c.name}</td>
                        <td className="border border-stone-300 px-2 py-1.5 text-center font-black text-lg text-emerald-700">{c.lettini}</td>
                        <td className="border border-stone-300 px-2 py-1.5 text-[10px] sm:text-xs text-stone-500 no-print">
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

        <div className="mt-8 text-center text-[10px] text-stone-400 font-medium">
          Generato automaticamente da La Capannina Gestione
        </div>
      </div>
    </div>
  );
}

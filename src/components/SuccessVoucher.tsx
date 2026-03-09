import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, Hash, Mail, Phone, User, Waves, Home, Share2 } from 'lucide-react';

interface SuccessVoucherProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    userName: string;
    userEmail: string;
    userPhone: string;
    startDate: string;
    endDate: string;
    umbrellas: Array<{ row: number; number: number }>;
  };
}

function formatUmbrella(u: { row: number; number: number }) {
  return u.row === 0 ? 'Area Riva' : `Fila ${u.row} - N.${u.number * 10 + u.row}`;
}

export function SuccessVoucher({ isOpen, onClose, bookingDetails }: SuccessVoucherProps) {
  if (!isOpen) return null;

  const shareText = `🏖️ Prenotazione Confermata – La Capannina\n\nNome: ${bookingDetails.userName}\nDate: ${new Date(bookingDetails.startDate).toLocaleDateString('it-IT')} – ${new Date(bookingDetails.endDate).toLocaleDateString('it-IT')}\nPostazioni: ${bookingDetails.umbrellas.map(formatUmbrella).join(', ')}\n\nTi aspettiamo in spiaggia!`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '🏖️ Prenotazione Confermata – La Capannina',
          text: shareText,
        });
      } catch {
        // user cancelled share – ignore
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText);
      alert('Dettagli copiati negli appunti! Incollali in un messaggio.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full sm:max-w-md overflow-hidden shadow-2xl relative max-h-[95dvh] flex flex-col"
        >
          {/* Drag handle (mobile) */}
          <div className="sm:hidden flex justify-center pt-3 pb-1 flex-none">
            <div className="w-10 h-1 bg-stone-300 rounded-full" />
          </div>

          {/* Header - Ocean Theme */}
          <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-8 text-center relative overflow-hidden flex-none">
            <div className="absolute inset-0 opacity-20">
               <Waves className="absolute -bottom-4 -left-10 w-48 h-48 text-white" />
               <Waves className="absolute -top-10 -right-10 w-48 h-48 text-white" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg origin-center border-2 border-white/50"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-black text-white mb-1 tracking-wide relative z-10">Prenotazione Confermata!</h2>
            <p className="text-cyan-100 text-sm font-medium relative z-10">Ti aspettiamo in spiaggia, {bookingDetails.userName.split(' ')[0]} 🏖️</p>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-white z-20"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-white z-20"></div>
          </div>

          {/* Dotted divider */}
          <div className="w-full flex justify-center mt-[-1px] relative z-20 flex-none">
            <div className="w-[85%] border-t-2 border-dashed border-stone-200"></div>
          </div>

          {/* Scrollable details */}
          <div className="overflow-y-auto flex-1 p-6 pb-2">
            <div className="bg-slate-50/80 rounded-2xl p-5 space-y-5 border border-slate-100">

              {/* User Info */}
              <div className="grid grid-cols-1 gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center text-slate-700">
                  <User className="w-4 h-4 mr-3 text-cyan-600 shrink-0" />
                  <p className="font-semibold text-sm capitalize">{bookingDetails.userName}</p>
                </div>
                <div className="flex items-center text-slate-700">
                  <Mail className="w-4 h-4 mr-3 text-cyan-600 shrink-0" />
                  <p className="font-medium text-sm truncate">{bookingDetails.userEmail}</p>
                </div>
                <div className="flex items-center text-slate-700">
                  <Phone className="w-4 h-4 mr-3 text-cyan-600 shrink-0" />
                  <p className="font-medium text-sm">{bookingDetails.userPhone}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center text-slate-700">
                <Calendar className="w-5 h-5 mr-3 text-cyan-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date</p>
                  <p className="font-black text-slate-800">
                    {new Date(bookingDetails.startDate).toLocaleDateString('it-IT')} – {new Date(bookingDetails.endDate).toLocaleDateString('it-IT')}
                  </p>
                </div>
              </div>

              {/* Postazioni */}
              <div className="flex items-start text-slate-700">
                <MapPin className="w-5 h-5 mr-3 mt-1 text-cyan-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Postazioni</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {bookingDetails.umbrellas.map((u, i) => (
                      <span key={i} className="inline-flex items-center bg-cyan-100 text-cyan-800 text-xs font-black px-2.5 py-1 rounded-md shadow-sm border border-cyan-200">
                        <Hash className="w-3 h-3 mr-1 opacity-70" />
                        {formatUmbrella(u)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Email notice */}
            <div className="mt-4 p-3 rounded-xl bg-green-50/50 border border-green-100 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
              <p className="text-xs font-semibold text-green-700 text-center">Abbiamo inviato un'email di conferma con i dettagli alla tua casella di posta.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-3 flex-none">
            {/* Share button – prominent for iPhone */}
            <button
              onClick={handleShare}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-black rounded-xl shadow-lg shadow-cyan-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-base"
            >
              <Share2 className="w-5 h-5" />
              Condividi / Salva su iPhone
            </button>

            {/* Close + back home row */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onClose}
                className="py-3 bg-white border-2 border-slate-200 hover:border-cyan-400 hover:bg-cyan-50 text-slate-700 font-semibold rounded-xl transition-all active:scale-95 text-sm"
              >
                Torna alla mappa
              </button>
              <button
                onClick={() => { onClose(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="py-3 bg-white border-2 border-slate-200 hover:border-cyan-400 hover:bg-cyan-50 text-slate-700 font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 text-sm"
              >
                <Home className="w-4 h-4 text-cyan-600" />
                Home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

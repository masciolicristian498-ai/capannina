import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, Hash, QrCode, Mail, Phone, User, Waves } from 'lucide-react';

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

export function SuccessVoucher({ isOpen, onClose, bookingDetails }: SuccessVoucherProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl relative"
        >
          {/* Header - Ocean Theme */}
          <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-8 text-center relative overflow-hidden">
            {/* Background Waves */}
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
            
            {/* Decorative semi-circles for ticket effect */}
            <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-white z-20"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-white z-20"></div>
          </div>

          {/* Dotted line divider */}
          <div className="w-full flex justify-center mt-[-1px] relative z-20">
            <div className="w-[85%] border-t-2 border-dashed border-stone-200"></div>
          </div>

          {/* Details */}
          <div className="p-8 pb-4">
            <div className="bg-slate-50/80 rounded-2xl p-5 space-y-5 border border-slate-100 backdrop-blur-sm">
              
              {/* User Info Grid */}
              <div className="grid grid-cols-1 gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center text-slate-700">
                  <User className="w-4 h-4 mr-3 text-cyan-600" />
                  <p className="font-semibold text-sm capitalize">{bookingDetails.userName}</p>
                </div>
                <div className="flex items-center text-slate-700">
                  <Mail className="w-4 h-4 mr-3 text-cyan-600" />
                  <p className="font-medium text-sm truncate">{bookingDetails.userEmail}</p>
                </div>
                <div className="flex items-center text-slate-700">
                  <Phone className="w-4 h-4 mr-3 text-cyan-600" />
                  <p className="font-medium text-sm">{bookingDetails.userPhone}</p>
                </div>
              </div>

              {/* Booking Data Grid */}
              <div className="flex items-center text-slate-700 pt-2">
                <Calendar className="w-5 h-5 mr-3 text-cyan-600" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date</p>
                  <p className="font-black text-slate-800">{new Date(bookingDetails.startDate).toLocaleDateString('it-IT')} - {new Date(bookingDetails.endDate).toLocaleDateString('it-IT')}</p>
                </div>
              </div>

              <div className="flex items-start text-slate-700">
                <MapPin className="w-5 h-5 mr-3 mt-1 text-cyan-600" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Postazioni</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {bookingDetails.umbrellas.map((u, i) => (
                      <span key={i} className="inline-flex items-center bg-cyan-100 text-cyan-800 text-xs font-black px-2.5 py-1 rounded-md shadow-sm border border-cyan-200">
                        <Hash className="w-3 h-3 mr-1 opacity-70" />
                        {u.row === 0 ? `Riva` : `Fila ${u.row} - N.${(u.number * 10) + u.row}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Email Success */}
            <div className="mt-5 p-3 rounded-xl bg-green-50/50 border border-green-100 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-xs font-semibold text-green-700 text-center">Abbiamo inviato un'email di conferma con i dettagli alla tua casella di posta.</p>
            </div>

            {/* QR Code Placeholder */}
            <div className="mt-6 flex flex-col items-center">
              <div className="p-3 bg-white border-2 border-slate-100 rounded-xl shadow-sm mb-2 opacity-80">
                <QrCode className="w-16 h-16 text-slate-800" strokeWidth={1} />
              </div>
              <p className="text-[10px] text-slate-400 font-black font-mono tracking-widest uppercase">ID: BKG-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-slate-50 border-t border-slate-100">
             <button
               onClick={onClose}
               className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-black rounded-xl shadow-lg shadow-cyan-500/30 transition-all active:scale-95 flex items-center justify-center h-[56px]"
             >
               Chiudi e torna alla spiaggia
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

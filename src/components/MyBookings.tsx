import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, MapPin, Wallet, CreditCard, UserCheck, Clock, Trash2, ChevronRight, Waves, AlertCircle, Phone, Mail, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Booking } from '../types';

const COUNTRY_CODES = [
  { code: '+39', flag: '🇮🇹' }, { code: '+1', flag: '🇺🇸' }, { code: '+44', flag: '🇬🇧' },
  { code: '+33', flag: '🇫🇷' }, { code: '+49', flag: '🇩🇪' }, { code: '+34', flag: '🇪🇸' },
  { code: '+351', flag: '🇵🇹' }, { code: '+41', flag: '🇨🇭' }, { code: '+43', flag: '🇦🇹' },
  { code: '+31', flag: '🇳🇱' }, { code: '+48', flag: '🇵🇱' }, { code: '+7', flag: '🇷🇺' },
];

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatPostazione(b: Booking) {
  if (b.row_number === 0) {
    const zone = b.zone_id ? `Zona ${b.zone_id}` : `Zona ${b.umbrella_number === 1 ? 'A' : b.umbrella_number === 2 ? 'B' : 'C'}`;
    return `Riva – ${zone}${b.quantity && b.quantity > 1 ? ` (×${b.quantity} lettini)` : ''}`;
  }
  return `Fila ${b.row_number}, Ombrellone N.${b.umbrella_number * 10 + b.row_number}`;
}

function isFuture(b: Booking) {
  const today = new Date().toISOString().split('T')[0];
  return b.end_date >= today;
}

export function MyBookings() {
  const [searchMode, setSearchMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+39');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBookings(null);
    setDeleteSuccess(false);
    setLoading(true);
    try {
      let url = '/api/my-bookings?';
      if (searchMode === 'email') {
        if (!email.trim()) { setError('Inserisci la tua email'); setLoading(false); return; }
        url += `email=${encodeURIComponent(email.trim())}`;
      } else {
        if (!phoneNumber.trim()) { setError('Inserisci il tuo numero di telefono'); setLoading(false); return; }
        url += `phone=${encodeURIComponent(phonePrefix + phoneNumber.replace(/\s/g, ''))}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Errore nella ricerca'); } 
      else { setBookings(data); }
    } catch {
      setError('Errore di connessione. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Sei sicuro di voler annullare questa prenotazione?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      setBookings(prev => prev ? prev.filter(b => b.id !== id) : []);
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 4000);
    } catch {
      alert('Errore nell\'annullamento. Riprova.');
    } finally {
      setDeletingId(null);
    }
  };

  const future = bookings?.filter(isFuture) ?? [];
  const past   = bookings?.filter(b => !isFuture(b)) ?? [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Title */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4 shadow-sm">
          <Waves className="w-8 h-8 text-emerald-700" />
        </div>
        <h2 className="text-3xl font-extrabold text-emerald-900 tracking-tight">Le Mie Prenotazioni</h2>
        <p className="mt-2 text-stone-500 text-sm">Inserisci la tua email o telefono per ritrovare tutte le tue prenotazioni.</p>
      </motion.div>

      {/* Search Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6"
      >
        {/* Toggle email / phone */}
        <div className="flex bg-stone-100 rounded-xl p-1 mb-6">
          {(['email', 'phone'] as const).map(mode => (
            <button key={mode} type="button" onClick={() => { setSearchMode(mode); setError(''); setBookings(null); }}
              className={clsx('flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all',
                searchMode === mode ? 'bg-white shadow text-emerald-800' : 'text-stone-500 hover:text-stone-700'
              )}>
              {mode === 'email' ? <><Mail className="w-4 h-4" /> Email</> : <><Phone className="w-4 h-4" /> Telefono</>}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <AnimatePresence mode="wait">
            {searchMode === 'email' ? (
              <motion.div key="email" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">La tua email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-shadow text-stone-800"
                  placeholder="mario@example.com" />
              </motion.div>
            ) : (
              <motion.div key="phone" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Il tuo numero di telefono</label>
                <div className="flex gap-2">
                  <select value={phonePrefix} onChange={e => setPhonePrefix(e.target.value)}
                    className="w-28 px-2 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none text-sm bg-white">
                    {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                  </select>
                  <input type="tel" inputMode="numeric" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/[^\d\s\-]/g, ''))}
                    className="flex-1 px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-shadow"
                    placeholder="333 1234567" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button type="submit" disabled={loading} whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.97 } : {}}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Cerco…</> : <><Search className="w-5 h-5" /> Cerca prenotazioni</>}
          </motion.button>
        </form>
      </motion.div>

      {/* Delete success toast */}
      <AnimatePresence>
        {deleteSuccess && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
            <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-semibold">Prenotazione annullata con successo.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {bookings !== null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
            
            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 shadow-sm">
                <div className="text-5xl mb-4">🏖️</div>
                <p className="text-stone-600 font-semibold text-lg">Nessuna prenotazione trovata</p>
                <p className="text-stone-400 text-sm mt-2">Controlla l'email o il telefono e riprova.</p>
              </div>
            ) : (
              <>
                {/* Summary pill */}
                <div className="flex justify-center">
                  <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-5 py-2 rounded-full shadow-sm">
                    {bookings.length} prenotazion{bookings.length === 1 ? 'e' : 'i'} trovat{bookings.length === 1 ? 'a' : 'e'}
                  </span>
                </div>

                {/* Future bookings */}
                {future.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">🟢 Prenotazioni attive / future</h3>
                    {future.map((b, i) => <BookingCard key={b.id} booking={b} index={i} onDelete={handleDelete} deletingId={deletingId} canDelete />)}
                  </div>
                )}

                {/* Past bookings */}
                {past.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mt-4">⏳ Prenotazioni passate</h3>
                    {past.map((b, i) => <BookingCard key={b.id} booking={b} index={i} onDelete={handleDelete} deletingId={deletingId} canDelete={false} />)}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({ booking: b, index, onDelete, deletingId, canDelete }: {
  booking: Booking; index: number; onDelete: (id: number) => Promise<void>; deletingId: number | null; canDelete: boolean;
}) {
  const isDeleting = deletingId === b.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className={clsx('bg-white rounded-2xl border shadow-sm overflow-hidden transition-all',
        canDelete ? 'border-emerald-200 hover:shadow-md' : 'border-stone-200 opacity-70'
      )}
    >
      {/* Top color bar */}
      <div className={clsx('h-1.5 w-full', canDelete ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' : 'bg-stone-200')} />

      <div className="p-5 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-bold text-stone-900 text-base">{b.user_name}</p>
            <p className="text-xs text-stone-400 mt-0.5">{b.user_email} · {b.user_phone}</p>
          </div>
          <span className={clsx('shrink-0 text-xs font-bold px-2.5 py-1 rounded-full',
            canDelete ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'
          )}>
            {canDelete ? 'Attiva' : 'Passata'}
          </span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 gap-2.5 text-sm">
          <div className="flex items-center gap-2.5 text-stone-700">
            <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{formatDate(b.start_date)} → {formatDate(b.end_date)}</span>
          </div>
          <div className="flex items-center gap-2.5 text-stone-700">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold">{formatPostazione(b)}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Pagamento */}
            <span className={clsx('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold',
              b.is_paid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            )}>
              {b.payment_method === 'cassa' ? <Wallet className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
              {b.is_paid ? 'Pagato' : (b.payment_method === 'cassa' ? 'Da pagare in cassa' : 'In attesa')}
            </span>
            {/* Check-in */}
            <span className={clsx('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
              b.checked_in ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-500'
            )}>
              {b.checked_in ? <UserCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {b.checked_in ? 'Check-in effettuato' : 'In attesa arrivo'}
            </span>
            {/* Totale */}
            <span className="font-bold text-stone-800 ml-auto">€{b.total_price}</span>
          </div>
        </div>

        {/* Services */}
        {b.services && b.services.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {b.services.map((s, i) => (
              <span key={i} className="text-[11px] bg-stone-50 text-stone-500 border border-stone-200 rounded-full px-2.5 py-0.5">
                {s.quantity}× {s.type.replace('_', ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Cancel button */}
        {canDelete && (
          <div className="border-t border-stone-100 pt-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(b.id!)} disabled={isDeleting}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors disabled:opacity-50">
              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              {isDeleting ? 'Annullamento…' : 'Annulla prenotazione'}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

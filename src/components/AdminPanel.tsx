import { useState, useEffect, useCallback } from 'react';
import { Booking } from '../types';
import {
  CheckCircle, Clock, Trash2, Search, Calendar,
  Users, Wallet, CreditCard, UserCheck, RefreshCw,
  TrendingUp, AlertCircle, LogIn, Waves
} from 'lucide-react';
import { clsx } from 'clsx';
import { RivaPrintList } from './RivaPrintList';

const today = () => new Date().toISOString().split('T')[0];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatPostazione(b: Booking) {
  if (b.row_number === 0) {
    const zone = b.zone_id ? `Zona ${b.zone_id}` : `Lettino N.${b.umbrella_number}`;
    return `Riva – ${zone}${b.quantity && b.quantity > 1 ? ` (×${b.quantity})` : ''}`;
  }
  return `Fila ${b.row_number}, N.${b.umbrella_number * 10 + b.row_number}`;
}

export function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState(today());
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'all' | 'riva'>('today');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (!showAll && activeTab !== 'all') params.set('date', filterDate);
      if (search.trim()) params.set('search', search.trim());
      const res = await fetch(`/api/bookings?${params}`);
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filterDate, search, showAll, activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => fetchBookings(), 300);
    return () => clearTimeout(timer);
  }, [fetchBookings]);

  const handlePay = async (id: number) => {
    await fetch(`/api/bookings/${id}/pay`, { method: 'PUT' });
    fetchBookings();
  };

  const handleCheckin = async (id: number) => {
    await fetch(`/api/bookings/${id}/checkin`, { method: 'PUT' });
    fetchBookings();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Sei sicuro di voler eliminare questa prenotazione?')) return;
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    fetchBookings();
  };

  // KPI calculations
  const arriviOggi = bookings.filter(b => b.start_date <= today() && b.end_date >= today()).length;
  const daIncassare = bookings
    .filter(b => b.payment_method === 'cassa' && !b.is_paid && b.start_date <= today() && b.end_date >= today())
    .reduce((s, b) => s + b.total_price, 0);
  const checkedIn = bookings.filter(b => b.checked_in).length;
  const daCheckin = bookings.filter(b => !b.checked_in && b.start_date <= today() && b.end_date >= today()).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Pannello Amministratore</h2>
          <p className="text-stone-500 text-sm mt-1">Gestione prenotazioni, cassa e arrivi</p>
        </div>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors shadow-sm text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Aggiorna
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-stone-500">Arrivi Oggi</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{arriviOggi}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-stone-500">Da Incassare</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">€{daIncassare.toFixed(0)}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-stone-500">Check-in Effettuati</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{checkedIn}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-stone-500">In Attesa Check-in</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{daCheckin}</p>
        </div>
      </div>

      {/* Filters + Tab Bar */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Cerca per nome, email o telefono…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-shadow"
            />
          </div>

          {/* Date filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="date"
                value={filterDate}
                onChange={e => { setFilterDate(e.target.value); setActiveTab('today'); setShowAll(false); }}
                className="pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            {/* Tab: Oggi */}
            <button
              onClick={() => { setShowAll(false); setFilterDate(today()); setActiveTab('today'); }}
              className={clsx(
                "px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors whitespace-nowrap",
                activeTab === 'today' && !showAll
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
              )}
            >
              Oggi
            </button>

            {/* Tab: Tutte */}
            <button
              onClick={() => { setShowAll(true); setActiveTab('all'); }}
              className={clsx(
                "px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors whitespace-nowrap",
                activeTab === 'all'
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
              )}
            >
              <TrendingUp className="w-4 h-4 inline mr-1.5" />
              Tutte
            </button>

            {/* Tab: Distinta Riva */}
            <button
              onClick={() => { setShowAll(false); setActiveTab('riva'); }}
              className={clsx(
                "px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors whitespace-nowrap",
                activeTab === 'riva'
                  ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-200"
                  : "bg-white text-cyan-700 border-cyan-200 hover:bg-cyan-50"
              )}
            >
              <Waves className="w-4 h-4 inline mr-1.5" />
              Distinta Riva
            </button>
          </div>
        </div>
      </div>

      {/* Content: Distinta Riva OR Bookings Table */}
      {activeTab === 'riva' ? (
        <RivaPrintList bookings={bookings} date={filterDate} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-stone-400 text-sm">Caricamento…</div>
            ) : bookings.length === 0 ? (
              <div className="p-12 text-center text-stone-400 text-sm">
                {search ? `Nessun risultato per "${search}".` : 'Nessuna prenotazione trovata per questa data.'}
              </div>
            ) : (
              <table className="w-full text-left text-sm text-stone-600">
                <thead className="text-xs text-stone-700 uppercase bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Cliente</th>
                    <th className="px-5 py-4 font-semibold">Postazione</th>
                    <th className="px-5 py-4 font-semibold">Date</th>
                    <th className="px-5 py-4 font-semibold">Pagamento</th>
                    <th className="px-5 py-4 font-semibold">Importo</th>
                    <th className="px-5 py-4 font-semibold">Stato</th>
                    <th className="px-5 py-4 font-semibold text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className={clsx(
                        "hover:bg-stone-50 transition-colors",
                        booking.checked_in && "bg-emerald-50/40"
                      )}
                    >
                      {/* Cliente */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-stone-900">{booking.user_name}</div>
                        <div className="text-xs text-stone-400 mt-0.5">{booking.user_email}</div>
                        <div className="text-xs text-stone-400">{booking.user_phone}</div>
                      </td>

                      {/* Postazione */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {formatPostazione(booking)}
                        </span>
                        {booking.services && booking.services.length > 0 && (
                          <ul className="mt-2 text-xs text-stone-400 space-y-0.5">
                            {booking.services.map((s, i) => (
                              <li key={i}>{s.quantity}× {s.type.replace('_', ' ')}</li>
                            ))}
                          </ul>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs">
                        <span className="font-medium text-stone-700">{formatDate(booking.start_date)}</span>
                        <span className="mx-1 text-stone-300">→</span>
                        <span className="font-medium text-stone-700">{formatDate(booking.end_date)}</span>
                      </td>

                      {/* Pagamento */}
                      <td className="px-5 py-4">
                        {booking.payment_method === 'cassa' ? (
                          <span className={clsx(
                            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
                            booking.is_paid
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          )}>
                            <Wallet className="w-3 h-3" />
                            {booking.is_paid ? 'Cassa – Pagato' : 'IN CASSA'}
                          </span>
                        ) : (
                          <span className={clsx(
                            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                            booking.is_paid
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-stone-100 text-stone-500"
                          )}>
                            <CreditCard className="w-3 h-3" />
                            Online
                          </span>
                        )}
                      </td>

                      {/* Importo */}
                      <td className="px-5 py-4 font-bold text-stone-900">
                        €{booking.total_price}
                      </td>

                      {/* Stato Check-in */}
                      <td className="px-5 py-4">
                        {booking.checked_in ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                            <UserCheck className="w-4 h-4" />
                            Arrivato
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-stone-400 text-xs font-medium">
                            <Clock className="w-4 h-4" />
                            Atteso
                          </span>
                        )}
                        <div className="mt-1">
                          {booking.is_paid ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 text-xs">
                              <CheckCircle className="w-3.5 h-3.5" /> Pagato
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-500 text-xs">
                              <AlertCircle className="w-3.5 h-3.5" /> Non pagato
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Azioni */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2 items-end">
                          {/* Check-in button */}
                          {!booking.checked_in && (
                            <button
                              onClick={() => handleCheckin(booking.id!)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                            >
                              <LogIn className="w-3.5 h-3.5" />
                              Check-in
                            </button>
                          )}

                          {/* Pay at register button */}
                          {!booking.is_paid && booking.payment_method === 'cassa' && (
                            <button
                              onClick={() => handlePay(booking.id!)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                            >
                              <Wallet className="w-3.5 h-3.5" />
                              Riscuoti
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(booking.id!)}
                            className="text-stone-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Elimina prenotazione"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer */}
          {!loading && bookings.length > 0 && (
            <div className="border-t border-stone-100 px-5 py-3 bg-stone-50 text-xs text-stone-400 flex items-center justify-between">
              <span>{bookings.length} prenotazioni trovate</span>
              <span>Totale: <strong className="text-stone-700">€{bookings.reduce((s, b) => s + b.total_price, 0).toFixed(2)}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

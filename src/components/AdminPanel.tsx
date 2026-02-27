import { useState, useEffect } from 'react';
import { Booking } from '../types';
import { CheckCircle, Clock, Trash2 } from 'lucide-react';

export function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePay = async (id: number) => {
    try {
      await fetch(`/api/bookings/${id}/pay`, { method: 'PUT' });
      fetchBookings();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Sei sicuro di voler eliminare questa prenotazione?')) return;
    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      fetchBookings();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8 text-center text-stone-500">Caricamento prenotazioni...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-stone-900 mb-6">Pannello Amministratore</h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-500">
            <thead className="text-xs text-stone-700 uppercase bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Postazione</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Servizi</th>
                <th className="px-6 py-4 font-semibold">Totale</th>
                <th className="px-6 py-4 font-semibold">Stato</th>
                <th className="px-6 py-4 font-semibold text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-stone-500">Nessuna prenotazione trovata.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-stone-900">{booking.user_name}</div>
                      <div className="text-xs text-stone-500">{booking.user_email}</div>
                      <div className="text-xs text-stone-500">{booking.user_phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {booking.row_number === 0 
                          ? `Riva, Lettino N. ${booking.umbrella_number}`
                          : `Fila ${booking.row_number}, N. ${booking.umbrella_number * 10 + booking.row_number}`
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(booking.start_date).toLocaleDateString('it-IT')} <br/>
                      <span className="text-stone-400">al</span> <br/>
                      {new Date(booking.end_date).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-6 py-4">
                      <ul className="list-disc list-inside text-xs">
                        {booking.services.map((s, i) => (
                          <li key={i}>{s.quantity}x {s.type.replace('_', ' ')}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 font-semibold text-stone-900">
                      €{booking.total_price}
                    </td>
                    <td className="px-6 py-4">
                      {booking.is_paid ? (
                        <span className="inline-flex items-center text-emerald-600 text-xs font-medium">
                          <CheckCircle className="w-4 h-4 mr-1" /> Pagato
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-amber-600 text-xs font-medium">
                          <Clock className="w-4 h-4 mr-1" /> In attesa
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {!booking.is_paid && (
                        <button
                          onClick={() => handlePay(booking.id!)}
                          className="text-xs font-medium text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Segna Pagato
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(booking.id!)}
                        className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Elimina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

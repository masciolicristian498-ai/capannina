import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BeachGrid } from './components/BeachGrid';
import { BookingCart } from './components/BookingCart';
import { AdminPanel } from './components/AdminPanel';
import { Umbrella, Booking } from './types';
import { ROWS, UMBRELLAS_PER_ROW } from './constants';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, ShieldAlert, ChevronDown } from 'lucide-react';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  const [umbrellas, setUmbrellas] = useState<Umbrella[]>([]);
  const [selectedUmbrellas, setSelectedUmbrellas] = useState<Umbrella[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?startDate=${startDate}&endDate=${endDate}`);
      const bookings: Booking[] = await res.json();

      const newUmbrellas: Umbrella[] = [];
      
      // Riva (Row 0)
      for (let n = 1; n <= 30; n++) {
        const booking = bookings.find(b => b.row_number === 0 && b.umbrella_number === n);
        newUmbrellas.push({
          row: 0,
          number: n,
          isBooked: !!booking,
          booking,
        });
      }

      // Rows 1 to ROWS
      for (let r = 1; r <= ROWS; r++) {
        for (let n = 1; n <= UMBRELLAS_PER_ROW; n++) {
          const booking = bookings.find(b => b.row_number === r && b.umbrella_number === n);
          newUmbrellas.push({
            row: r,
            number: n,
            isBooked: !!booking,
            booking,
          });
        }
      }
      setUmbrellas(newUmbrellas);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
    setSelectedUmbrellas([]);
  }, [startDate, endDate]);

  const handleToggleSelect = (umbrella: Umbrella) => {
    setSelectedUmbrellas(prev => {
      const exists = prev.find(u => u.row === umbrella.row && u.number === umbrella.number);
      if (exists) {
        return prev.filter(u => !(u.row === umbrella.row && u.number === umbrella.number));
      } else {
        return [...prev, umbrella];
      }
    });
  };

  const handleBook = async (bookingData: any) => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Errore durante la prenotazione');
    }
    
    await fetchAvailability();
    setSelectedUmbrellas([]);
  };

  const scrollToBooking = () => {
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <Header />
      
      {!isAdmin && (
        <div className="relative bg-emerald-900 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80"
              alt="Spiaggia La Capannina"
              className="w-full h-full object-cover opacity-40"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
              Benvenuti a La Capannina
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-emerald-100 mb-10">
              Il tuo angolo di paradiso a Lavinio. Sabbia finissima, mare cristallino e tutti i comfort per una giornata indimenticabile.
            </p>
            <button
              onClick={scrollToBooking}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-emerald-900 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              Prenota Ora
              <ChevronDown className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="booking-section">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-900 tracking-tight">
            {isAdmin ? 'Gestione Stabilimento' : 'Prenota il tuo posto al sole'}
          </h2>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-200"
          >
            <ShieldAlert className="w-4 h-4 mr-2" />
            {isAdmin ? 'Vista Cliente' : 'Area Admin'}
          </button>
        </div>

        {isAdmin ? (
          <AdminPanel />
        ) : (
          <div className="space-y-8">
            {/* Date Picker Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex flex-col md:flex-row md:items-end gap-6">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-semibold text-emerald-800 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2 text-emerald-600" />
                  Data Arrivo
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-shadow text-stone-700 font-medium"
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-semibold text-emerald-800 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2 text-emerald-600" />
                  Data Partenza
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-shadow text-stone-700 font-medium"
                />
              </div>
              <div className="flex-none">
                <button
                  onClick={fetchAvailability}
                  className="w-full md:w-auto px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  Verifica Disponibilità
                </button>
              </div>
            </div>

            {/* Beach Grid */}
            {loading ? (
              <div className="h-64 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-emerald-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-emerald-900">Mappa Spiaggia</h3>
                  <div className="flex space-x-4 text-sm font-medium">
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-300 mr-2 shadow-sm"></span> Libero</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-100 border border-red-300 mr-2 shadow-sm"></span> Occupato</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-700 mr-2 shadow-sm"></span> Selezionato</div>
                  </div>
                </div>
                <BeachGrid
                  umbrellas={umbrellas}
                  onToggleSelect={handleToggleSelect}
                  selectedUmbrellas={selectedUmbrellas}
                />
              </div>
            )}

            {selectedUmbrellas.length > 0 && !isAdmin && (
              <BookingCart
                selectedUmbrellas={selectedUmbrellas}
                startDate={startDate}
                endDate={endDate}
                onCancel={() => setSelectedUmbrellas([])}
                onBook={handleBook}
                onRemoveItem={handleToggleSelect}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

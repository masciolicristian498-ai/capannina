import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BeachGrid } from './components/BeachGrid';
import { BookingCart } from './components/BookingCart';
import { AdminPanel } from './components/AdminPanel';
import { SuccessVoucher } from './components/SuccessVoucher';
import { BeachSkeleton } from './components/BeachSkeleton';
import { MyBookings } from './components/MyBookings';
import { PoolSection } from './components/PoolSection';
import { ServiceCards } from './components/ServiceCards';
import { Umbrella, Booking } from './types';
import { ROWS, UMBRELLAS_PER_ROW, RIVA_ZONES, POOL } from './constants';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, ShieldAlert, ChevronDown, Cloud, Star, Anchor, Fish } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'my-bookings'>('home');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  const [umbrellas, setUmbrellas] = useState<Umbrella[]>([]);
  const [selectedUmbrellas, setSelectedUmbrellas] = useState<Umbrella[]>([]);
  const [loading, setLoading] = useState(true);
  const [voucherData, setVoucherData] = useState<any>(null);
  const [poolAvailable, setPoolAvailable] = useState(POOL.maxCapacity);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?startDate=${startDate}&endDate=${endDate}`);
      const bookings: Booking[] = await res.json();

      const newUmbrellas: Umbrella[] = [];

      // Riva Zones (Row 0)
      RIVA_ZONES.forEach((zone: any, index: number) => {
        // Calculate how many lettini are booked in this zone for the selected period
        // For simplicity, we assume each booking for this zone_id adds to the booked quantity
        // Note: we need to handle quantity differently if it's multiple services per booking
        // Filter by umbrella_number (1=A, 2=B, 3=C) because zone_id may be null in older records
        const zoneUmbrellaNumber = index + 1;
        const zoneBookings = bookings.filter(b => b.row_number === 0 && b.umbrella_number === zoneUmbrellaNumber);
        const bookedQuantity = zoneBookings.reduce((sum, b) => sum + (b.quantity || 1), 0);

        newUmbrellas.push({
          row: 0,
          number: index + 1, // 1 for A, 2 for B, 3 for C
          isBooked: bookedQuantity >= zone.maxCapacity,
          isZone: true,
          zoneId: zone.id,
          zoneName: zone.name,
          maxCapacity: zone.maxCapacity,
          availableQuantity: Math.max(0, zone.maxCapacity - bookedQuantity),
          selectedQuantity: 0, // Default to 0 until user selects it
        });
      });

      // Rows 1 to ROWS
      for (let r = 1; r <= ROWS; r++) {
        for (let n = 1; n <= UMBRELLAS_PER_ROW; n++) {
          const booking = bookings.find(b => b.row_number === r && b.umbrella_number === n);
          newUmbrellas.push({
            row: r,
            number: n,
            isBooked: !!booking,
            booking,
            isSubscription: !!booking?.is_subscription,
          });
        }
      }
      setUmbrellas(newUmbrellas);

      // Pool availability (row_number = -1)
      const poolBooked = bookings
        .filter(b => b.row_number === -1)
        .reduce((sum, b) => sum + (b.quantity || 1), 0);
      setPoolAvailable(Math.max(0, POOL.maxCapacity - poolBooked));

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

    setVoucherData({
      userName: bookingData[0].user_name,
      userEmail: bookingData[0].user_email,
      userPhone: bookingData[0].user_phone,
      startDate: bookingData[0].start_date,
      endDate: bookingData[0].end_date,
      umbrellas: bookingData.map((b: any) => ({
        row: b.row_number,
        number: b.umbrella_number
      }))
    });

    setSelectedUmbrellas([]);
  };

  const scrollToBooking = () => {
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <Header currentPage={currentPage} onNavigate={(page) => { setCurrentPage(page); setIsAdmin(false); }} />

      {/* ── Le Mie Prenotazioni ── */}
      {currentPage === 'my-bookings' && (
        <main>
          <MyBookings />
        </main>
      )}

      {/* ── Home / Spiaggia ── */}
      {currentPage === 'home' && !isAdmin && (
        <>
          {/* Hero Section */}
          <div className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src="/capannina-sunset.png"
                alt="Spiaggia La Capannina Sunset"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-emerald-900/70" />
            </div>

            <div className="relative z-10 text-center px-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg"
              >
                Benvenuti a <span className="text-emerald-700">La Capannina</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-md font-medium"
              >
                Il tuo angolo di paradiso a Lavinio. Sabbia finissima, mare cristallino e tutti i comfort per una giornata indimenticabile.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToBooking}
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-emerald-950 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white shadow-xl"
              >
                Prenota Ora
                <ChevronDown className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
              </motion.button>
            </div>

            {/* Clouds */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              <motion.div
                className="absolute top-10 left-[10%]"
                animate={{ x: [0, 100, 0] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                <Cloud className="w-24 h-24 text-white/20" />
              </motion.div>
            </div>
          </div>
        </>
      )}

      {/* Chi Siamo Section with Ambient Elements */}
      {currentPage === 'home' && !isAdmin && (
        <div className="bg-white py-16 lg:py-24 border-b border-stone-100 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-10">
            <motion.div
              className="absolute top-10 right-[5%] drop-shadow-sm"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-24 h-24 text-red-400 fill-red-300/80" />
            </motion.div>
            <motion.div
              className="absolute bottom-20 left-[2%] drop-shadow-sm"
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              <Anchor className="w-32 h-32 text-slate-800 opacity-20" />
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="mb-10 lg:mb-0"
              >
                <h2 className="text-3xl font-bold text-emerald-900 mb-6 tracking-tight">Vivi l'estate perfetta con noi</h2>
                <p className="text-lg text-stone-600 mb-4 leading-relaxed">
                  Da oltre trent'anni La Capannina è il punto di riferimento a Lavinio per chi cerca una vacanza all'insegna del puro relax e del divertimento in un ambiente curato e familiare.
                </p>
                <p className="text-lg text-stone-600 leading-relaxed">
                  Gestito con passione, il nostro stabilimento dispone della rinomata e modernissima "Area Riva" direttamente a contatto col bagnasciuga, e un'organizzazione su file che garantisce privacy e tranquillità. Potrai degustare ottimi stuzzichini sotto l'ombrellone o nel nostro bar centrale.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  src="/capannina-sunset.png"
                  alt="Il nostro lido al tramonto"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-emerald-900/10 pointer-events-none"></div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* I Nostri Servizi Section with Ambient Elements */}
      {currentPage === 'home' && !isAdmin && (
        <div className="bg-gradient-to-b from-stone-50 to-emerald-50/30 py-16 lg:py-24 relative overflow-hidden">

          {/* Floating Fishes & Bubbles (z-0 to ensure they stay strictly IN BACK of the cards) */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Textured Bubbles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`bubble-${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${10 + (i * 12)}%`,
                  width: `${8 + (Math.random() * 24)}px`,
                  height: `${8 + (Math.random() * 24)}px`,
                  background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(110, 231, 183, 0.2), rgba(16, 185, 129, 0.1))',
                  boxShadow: 'inset 2px 2px 4px rgba(255, 255, 255, 0.6), inset -2px -2px 4px rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
                initial={{ bottom: '-10%', opacity: 0 }}
                animate={{
                  bottom: '120%',
                  opacity: [0, 0.9, 0],
                  x: [0, Math.random() > 0.5 ? 30 : -30, 0]
                }}
                transition={{
                  duration: 4 + Math.random() * 6,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 5
                }}
              />
            ))}

          </div>
          {/* Wrapper with overflow-hidden to prevent fishes from causing horizontal scroll */}
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {/* Original Cute Fishes Placed in Empty Spaces */}
            <motion.div
              className="absolute top-8 left-[-10%]"
              animate={{ x: ['0vw', '110vw'], y: [0, -10, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              {/* Swims right -> normal orientation because Lucide Fish faces right by default */}
              <Fish className="w-12 h-12 text-orange-400 fill-orange-300 drop-shadow-md opacity-80" />
            </motion.div>

            <motion.div
              className="absolute top-16 right-[-10%]"
              animate={{ x: ['10vw', '-110vw'], y: [0, 15, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
            >
              {/* Swims left -> needs scaleX(-1) to flip it */}
              <Fish className="w-10 h-10 text-blue-400 fill-blue-300 drop-shadow-md opacity-70 transform -scale-x-100" />
            </motion.div>

            <motion.div
              className="absolute bottom-8 right-[-10%]"
              animate={{ x: ['10vw', '-110vw'], y: [0, -10, 0] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 8 }}
            >
              {/* Swims left -> needs scaleX(-1) to flip it */}
              <Fish className="w-14 h-14 text-emerald-500 fill-emerald-400 drop-shadow-lg opacity-80 transform -scale-x-100" />
            </motion.div>
          </div>

          {/* Animated Sweeping Wave for Services */}
          <div className="absolute inset-x-0 bottom-0 h-80 overflow-hidden pointer-events-none z-0 opacity-80">
            <motion.svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="absolute bottom-0 w-[200%] h-full fill-emerald-200/80"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C79.44,115.54,166.7,126.91,245.8,111.45A651.92,651.92,0,0,0,321.39,56.44Z" />
            </motion.svg>
            {/* Second wave layer for more depth */}
            <motion.svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="absolute bottom-0 w-[200%] h-3/4 fill-emerald-300/60"
              animate={{ x: ['-50%', '0%'] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C79.44,115.54,166.7,126.91,245.8,111.45A651.92,651.92,0,0,0,321.39,56.44Z" />
            </motion.svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-emerald-900 tracking-tight">I Nostri Servizi</h2>
              <p className="mt-4 text-lg text-stone-600">Tutto ciò di cui hai bisogno per la tua giornata ideale.</p>
            </div>

            <ServiceCards />
          </div>
        </div>
      )}

      {/* Booking Section */}
      {currentPage === 'home' && (
            <main
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
              id="booking-section"
              style={{ height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              {/* Title + Admin toggle */}
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h2 className="text-2xl font-bold text-emerald-900 tracking-tight">
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
                <div className="flex-1 overflow-y-auto">
                  <AdminPanel />
                </div>
              ) : (
                <div className="flex flex-col flex-1 min-h-0 gap-4">
                  {/* Date Picker — compact, fixed height */}
                  <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-emerald-100 flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 flex-1">
                      <CalendarIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                      <label className="text-xs font-semibold text-emerald-800 whitespace-nowrap">Arrivo</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-stone-700 font-medium text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <CalendarIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                      <label className="text-xs font-semibold text-emerald-800 whitespace-nowrap">Partenza</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        className="flex-1 px-3 py-1.5 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-stone-700 font-medium text-sm"
                      />
                    </div>
                    <button
                      onClick={fetchAvailability}
                      className="shrink-0 px-6 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 text-sm"
                    >
                      Verifica Disponibilità
                    </button>
                  </div>

                  {/* Beach Grid — fills remaining vertical space, horizontal scroll only */}
                  {loading ? (
                    <BeachSkeleton />
                  ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 flex flex-col flex-1 min-h-[280px] overflow-hidden">
                      {/* Header row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-2 gap-2 border-b border-emerald-50 shrink-0">
                        <h3 className="text-sm font-bold text-emerald-900">🗺️ Mappa Spiaggia</h3>
                        <div className="flex flex-wrap gap-2.5 text-xs font-medium">
                          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-100 border border-emerald-300 mr-1"></span>Libero</div>
                          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-100 border border-red-300 mr-1"></span>Occupato</div>
                          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1"></span>Abbonato</div>
                          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-700 mr-1"></span>Selezionato</div>
                        </div>
                      </div>
                      {/* Grid — overflow-y auto (scrolls inside card), overflow-x auto */}
                      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto">
                        <BeachGrid
                          umbrellas={umbrellas}
                          onToggleSelect={handleToggleSelect}
                          selectedUmbrellas={selectedUmbrellas}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </main>
          )}

          {/* Pool + Cart sections — scroll naturally below the beach map */}
          {currentPage === 'home' && !isAdmin && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
              {/* Pool Section */}
              {!loading && <PoolSection />}

              {/* Booking Cart */}
              <AnimatePresence>
                {selectedUmbrellas.length > 0 && (
                  <motion.div
                    key="booking-cart-wrapper"
                    id="cart-section"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <BookingCart
                      selectedUmbrellas={selectedUmbrellas}
                      startDate={startDate}
                      endDate={endDate}
                      onCancel={() => setSelectedUmbrellas([])}
                      onBook={handleBook}
                      onRemoveItem={handleToggleSelect}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <SuccessVoucher
            isOpen={!!voucherData}
            onClose={() => setVoucherData(null)}
            bookingDetails={voucherData || { userName: '', userEmail: '', userPhone: '', startDate: '', endDate: '', umbrellas: [] }}
          />
        </div>
      );
    }

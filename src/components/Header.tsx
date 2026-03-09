import { Sun, MapPin, Phone, ClipboardList } from 'lucide-react';

interface HeaderProps {
  currentPage: 'home' | 'my-bookings';
  onNavigate: (page: 'home' | 'my-bookings') => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="bg-white p-2 rounded-full shadow-md">
              <Sun className="h-7 w-7 text-emerald-600" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold tracking-tight text-white">La Capannina</h1>
              <p className="text-emerald-200 text-xs font-medium tracking-wide uppercase">Stabilimento Balneare</p>
            </div>
          </button>

          {/* Nav + Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {/* Nav tabs */}
            <nav className="flex bg-emerald-900/60 rounded-xl p-1 gap-1">
              <button
                onClick={() => onNavigate('home')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentPage === 'home'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-700/50'
                }`}
              >
                🏖️ Spiaggia
              </button>
              <button
                onClick={() => onNavigate('my-bookings')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentPage === 'my-bookings'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-700/50'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Le mie prenotazioni
              </button>
            </nav>

            {/* Info */}
            <div className="hidden md:flex items-center gap-3 text-emerald-200 text-xs">
              <div className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>Lavinio, Anzio (RM)</span>
              </div>
              <div className="w-1 h-1 bg-emerald-500 rounded-full" />
              <div className="flex items-center">
                <Phone className="h-3.5 w-3.5 mr-1" />
                <span>+39 06 981 1234</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

import { Sun, Waves, MapPin, Phone } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-emerald-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-full shadow-md">
              <Sun className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">La Capannina</h1>
              <p className="text-emerald-200 text-sm font-medium tracking-wide uppercase">Stabilimento Balneare</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-emerald-100">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Lavinio, Anzio (RM)</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-emerald-400 rounded-full"></div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span>+39 06 981 1234</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

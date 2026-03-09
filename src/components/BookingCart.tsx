import React, { useState, useEffect } from 'react';
import { Calendar, User, Mail, Phone, CreditCard, CheckCircle2, ShoppingCart, Wallet } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';
import { Umbrella, Service } from '../types';
import { PRICES } from '../constants';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

interface CartItem {
  umbrella: Umbrella;
  services: Service[];
}

interface BookingCartProps {
  selectedUmbrellas: Umbrella[];
  startDate: string;
  endDate: string;
  onBook: (bookings: any[]) => Promise<void>;
  onCancel: () => void;
  onRemoveItem: (umbrella: Umbrella) => void;
}

export function BookingCart({ selectedUmbrellas, startDate, endDate, onBook, onCancel, onRemoveItem }: BookingCartProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cassa'>('online');
  const [isSubscription, setIsSubscription] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCartItems(prev => {
      const newItems = selectedUmbrellas.map(u => {
        const existing = prev.find(p => p.umbrella.row === u.row && p.umbrella.number === u.number);
        if (existing) return existing;
        return {
          umbrella: u,
          services: u.row === 0 ? [] : [
            { type: 'lettino', quantity: 2 },
            { type: 'sdraio', quantity: 0 },
            { type: 'sedia_regista', quantity: 0 },
          ]
        };
      });
      return newItems;
    });
  }, [selectedUmbrellas]);

  const days = Math.max(1, differenceInDays(parseISO(endDate), parseISO(startDate)) + 1);

  const calculateItemTotal = (item: CartItem) => {
    if (item.umbrella.row === 0) {
      return PRICES.lettino_riva * days;
    }

    let total = PRICES.umbrella * days;

    let allServices: number[] = [];
    item.services.forEach(s => {
      for (let i = 0; i < s.quantity; i++) {
        allServices.push(PRICES[s.type]);
      }
    });

    allServices.sort((a, b) => b - a);
    const extraServices = allServices.slice(2);

    extraServices.forEach(price => {
      total += price * days;
    });

    return total;
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const updateService = (umbrella: Umbrella, type: Service['type'], delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.umbrella.row === umbrella.row && item.umbrella.number === umbrella.number) {
        const newServices = item.services.map(s => {
          if (s.type === type) {
            return { ...s, quantity: Math.max(0, s.quantity + delta) };
          }
          return s;
        });
        return { ...item, services: newServices };
      }
      return item;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const bookingsData = cartItems.map(item => ({
        row_number: item.umbrella.row,
        umbrella_number: item.umbrella.number,
        zone_id: item.umbrella.zoneId,
        quantity: item.umbrella.row === 0 ? (item.umbrella.selectedQuantity || 1) : 1,
        start_date: startDate,
        end_date: endDate,
        user_name: name,
        user_email: email,
        user_phone: phone,
        total_price: calculateItemTotal(item),
        is_paid: false,
        payment_method: paymentMethod,
        is_subscription: isSubscription,
        services: item.services.filter(s => s.quantity > 0)
      }));

      await onBook(bookingsData);
      // App.tsx handles success state via setSelectedUmbrellas([]) and showing the voucher
    } catch (error) {
      console.error(error);
      alert('Errore durante la prenotazione. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-white rounded-2xl shadow-md border border-stone-200 overflow-hidden mt-8" id="cart-section"
    >
      <div className="bg-emerald-800 px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <ShoppingCart className="w-6 h-6 text-emerald-200" />
          <div>
            <h2 className="text-xl font-bold">Carrello del tuo posto al sole</h2>
            <p className="text-emerald-100 text-sm">
              {cartItems.length} {cartItems.length === 1 ? 'postazione selezionata' : 'postazioni selezionate'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <form id="booking-form" onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Details & Services */}
            <div className="space-y-6">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-center space-x-4">
                <Calendar className="w-8 h-8 text-emerald-600" />
                <div>
                  <p className="text-sm text-stone-500 font-medium">Periodo Selezionato</p>
                  <p className="font-semibold text-stone-900">
                    {new Date(startDate).toLocaleDateString('it-IT')} - {new Date(endDate).toLocaleDateString('it-IT')}
                    <span className="ml-2 text-sm font-normal text-stone-500">({days} {days === 1 ? 'giorno' : 'giorni'})</span>
                  </p>
                </div>
              </div>

              {cartItems.map((item) => {
                const isRiva = item.umbrella.row === 0;
                const displayNumber = isRiva ? item.umbrella.number : item.umbrella.number * 10 + item.umbrella.row;

                return (
                  <div key={`${item.umbrella.row}-${item.umbrella.number}`} className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-stone-900">
                        {isRiva ? `${item.umbrella.zoneName}` : `Ombrellone N. ${displayNumber} (Fila ${item.umbrella.row})`}
                      </h3>
                      <button type="button" onClick={() => onRemoveItem(item.umbrella)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                        Rimuovi
                      </button>
                    </div>

                    {isRiva ? (
                      <div className="space-y-3">
                        <p className="text-xs text-stone-500">Seleziona quanti lettini vuoi in questa zona.</p>
                        <div className="flex items-center justify-between text-sm bg-stone-50 p-3 rounded-lg border border-stone-100">
                          <span className="text-stone-700 font-medium">Numero Lettini ({PRICES.lettino_riva}€ l'uno)</span>
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                setCartItems(prev => prev.map(p => {
                                  if (p.umbrella.row === item.umbrella.row && p.umbrella.number === item.umbrella.number) {
                                    const currentQty = p.umbrella.selectedQuantity || 1;
                                    if (currentQty > 1) {
                                      return { ...p, umbrella: { ...p.umbrella, selectedQuantity: currentQty - 1 } };
                                    }
                                  }
                                  return p;
                                }));
                              }}
                              disabled={(item.umbrella.selectedQuantity || 1) <= 1}
                              className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-200 disabled:opacity-50"
                            >-</button>
                            <span className="w-6 text-center font-bold text-lg">{item.umbrella.selectedQuantity || 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setCartItems(prev => prev.map(p => {
                                  if (p.umbrella.row === item.umbrella.row && p.umbrella.number === item.umbrella.number) {
                                    const currentQty = p.umbrella.selectedQuantity || 1;
                                    if (currentQty < (p.umbrella.availableQuantity || 50)) {
                                      return { ...p, umbrella: { ...p.umbrella, selectedQuantity: currentQty + 1 } };
                                    }
                                  }
                                  return p;
                                }));
                              }}
                              disabled={(item.umbrella.selectedQuantity || 1) >= (item.umbrella.availableQuantity || 50)}
                              className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-200 disabled:opacity-50"
                            >+</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-stone-500">2 servizi inclusi nel prezzo base.</p>
                        {[
                          { type: 'lettino', label: 'Lettino', price: PRICES.lettino },
                          { type: 'sdraio', label: 'Sdraio', price: PRICES.sdraio },
                          { type: 'sedia_regista', label: 'Sedia Regista', price: PRICES.sedia_regista },
                        ].map((service) => {
                          const currentQuantity = item.services.find(s => s.type === service.type)?.quantity || 0;
                          return (
                            <div key={service.type} className="flex items-center justify-between text-sm">
                              <span className="text-stone-700">{service.label}</span>
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => updateService(item.umbrella, service.type as Service['type'], -1)}
                                  disabled={currentQuantity === 0}
                                  className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-50"
                                >-</button>
                                <span className="w-4 text-center">{currentQuantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateService(item.umbrella, service.type as Service['type'], 1)}
                                  className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                                >+</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="mt-4 text-right font-semibold text-emerald-700">
                      Subtotale: €{calculateItemTotal(item)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: User Data */}
            <div>
              <h3 className="text-lg font-semibold text-stone-900 mb-4">I Tuoi Dati</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-700 flex items-center">
                    <User className="w-4 h-4 mr-1" /> Nome e Cognome
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-shadow"
                    placeholder="Mario Rossi"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-700 flex items-center">
                    <Mail className="w-4 h-4 mr-1" /> Email
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-shadow"
                    placeholder="mario@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-700 flex items-center">
                    <Phone className="w-4 h-4 mr-1" /> Telefono
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-shadow"
                    placeholder="+39 333 1234567"
                  />
                </div>

                <div className="space-y-1 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                  <div className="flex flex-col">
                     <label className="text-sm font-bold text-blue-900 flex items-center">
                        Abbonamento Stagionale/Mensile
                     </label>
                     <p className="text-xs text-blue-700 mt-1">Prenota l'ombrellone per lungo periodo (verrà mostrato in blu).</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSubscription}
                    onChange={e => setIsSubscription(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-3 pt-4 border-t border-stone-200 mt-6">
                  <label className="text-sm text-stone-700 font-bold block">Metodo di Pagamento</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online')}
                      className={clsx(
                        "flex flex-col items-center justify-center space-y-2 p-4 rounded-xl border-2 transition-all",
                        paymentMethod === 'online'
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm"
                          : "border-stone-200 bg-white text-stone-600 hover:border-emerald-300"
                      )}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span className="font-semibold text-sm">Paga Ora</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cassa')}
                      className={clsx(
                        "flex flex-col items-center justify-center space-y-2 p-4 rounded-xl border-2 transition-all",
                        paymentMethod === 'cassa'
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm"
                          : "border-stone-200 bg-white text-stone-600 hover:border-emerald-300"
                      )}
                    >
                      <Wallet className="w-6 h-6" />
                      <span className="font-semibold text-sm">Paga in Cassa</span>
                    </button>
                  </div>
                  <p className="text-xs text-stone-500 mt-2 text-center">
                    {paymentMethod === 'online'
                      ? "Paga in modo sicuro con la tua carta per confermare subito."
                      : "La postazione è riservata per 30 minuti. Recati in cassa per pagare."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="border-t border-stone-200 p-6 bg-stone-50 flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-4 sm:mb-0 text-center sm:text-left">
          <p className="text-sm text-stone-500 font-medium">Totale da pagare</p>
          <p className="text-3xl font-bold text-stone-900">€{calculateTotal()}</p>
        </div>
        <div className="flex space-x-4 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 transition-colors shadow-sm"
          >
            Annulla
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            form="booking-form"
            disabled={isSubmitting}
            className={clsx(
              "flex-1 sm:flex-none px-8 py-3 rounded-xl font-semibold text-white flex items-center justify-center transition-colors shadow-md",
              isSubmitting ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-700 hover:bg-emerald-800"
            )}
          >
            {isSubmitting ? 'Elaborazione...' : (
              <>
                {paymentMethod === 'online' ? <CreditCard className="w-5 h-5 mr-2" /> : <Wallet className="w-5 h-5 mr-2" />}
                {paymentMethod === 'online' ? 'Conferma e Paga' : 'Prenota Postazione'}
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

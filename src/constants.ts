export const ROWS = 4;
export const UMBRELLAS_PER_ROW = 31;

export const RIVA_ZONES = [
  { id: 'A', name: 'Zona A (Sinistra)', maxCapacity: 50 },
  { id: 'B', name: 'Zona B (Centrale)', maxCapacity: 50 },
  { id: 'C', name: 'Zona C (Destra)', maxCapacity: 50 },
];

export const POOL = {
  maxCapacity: 80,        // max persone al giorno
  pricePerPerson: 15,     // €/persona/giorno (include ombrellone + lettino)
  name: 'Area Piscina',
  ROW_NUMBER: -1,         // identificatore nel DB
  UMBRELLA_NUMBER: 1,     // fisso a 1 (un'unica "postazione" piscina)
};

export const PRICES = {
  umbrella: 30, // Base price per day (includes 2 services)
  lettino: 8,
  sdraio: 6,
  sedia_regista: 5,
  lettino_riva: 10,
  piscina: POOL.pricePerPerson,
};


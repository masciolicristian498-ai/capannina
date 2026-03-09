import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import cors from 'cors';

const db = new Database('capannina.db');

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    row_number INTEGER NOT NULL,
    umbrella_number INTEGER NOT NULL,
    zone_id TEXT,
    quantity INTEGER DEFAULT 1,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    total_price REAL NOT NULL,
    is_paid BOOLEAN NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'online',
    checked_in BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS booking_services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    service_type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY(booking_id) REFERENCES bookings(id)
  );
`);

// Safe migrations: add new columns if db was created before this update
const existingCols = (db.prepare("PRAGMA table_info(bookings)").all() as any[]).map((c: any) => c.name);
if (!existingCols.includes('payment_method')) db.exec("ALTER TABLE bookings ADD COLUMN payment_method TEXT DEFAULT 'online'");
if (!existingCols.includes('checked_in'))     db.exec("ALTER TABLE bookings ADD COLUMN checked_in BOOLEAN NOT NULL DEFAULT 0");
if (!existingCols.includes('zone_id'))        db.exec("ALTER TABLE bookings ADD COLUMN zone_id TEXT");
if (!existingCols.includes('quantity'))       db.exec("ALTER TABLE bookings ADD COLUMN quantity INTEGER DEFAULT 1");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // GET bookings — supports date range filter, single-day filter, and name/email search
  app.get('/api/bookings', (req, res) => {
    const { startDate, endDate, search, date } = req.query;
    let query = 'SELECT * FROM bookings WHERE 1=1';
    const params: any[] = [];

    if (startDate && endDate) {
      query += ' AND (start_date <= ? AND end_date >= ?)';
      params.push(endDate, startDate);
    }

    // Specific day filter (for the admin "Today's arrivals" view)
    if (date) {
      query += ' AND start_date <= ? AND end_date >= ?';
      params.push(date, date);
    }

    // Instant search by name or email
    if (search) {
      query += ' AND (user_name LIKE ? OR user_email LIKE ? OR user_phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const bookings = db.prepare(query).all(...params);

    const bookingsWithServices = bookings.map((b: any) => {
      const services = db.prepare('SELECT service_type as type, quantity FROM booking_services WHERE booking_id = ?').all(b.id);
      return {
        ...b,
        services,
        is_paid: !!b.is_paid,
        checked_in: !!b.checked_in,
      };
    });

    res.json(bookingsWithServices);
  });

  app.post('/api/bookings', (req, res) => {
    const bookingsData = Array.isArray(req.body) ? req.body : [req.body];

    // Check availability
    for (const b of bookingsData) {
      if (b.row_number === 0) {
        // Riva zone: check total booked quantity vs max capacity (50 per zone)
        const RIVA_MAX_CAPACITY = 50;
        const result = db.prepare(`
          SELECT COALESCE(SUM(quantity), 0) as booked
          FROM bookings 
          WHERE row_number = 0 AND umbrella_number = ? 
          AND (start_date <= ? AND end_date >= ?)
        `).get(b.umbrella_number, b.end_date, b.start_date) as any;

        const alreadyBooked = result?.booked ?? 0;
        const requestedQty = b.quantity ?? 1;

        if (alreadyBooked + requestedQty > RIVA_MAX_CAPACITY) {
          return res.status(400).json({ 
            error: `Zona Riva ${b.zone_id} esaurita per queste date. Disponibili: ${RIVA_MAX_CAPACITY - alreadyBooked} lettini.` 
          });
        }
      } else {
        // Normal umbrella: check if any booking exists for this spot and date range
        const existing = db.prepare(`
          SELECT id FROM bookings 
          WHERE row_number = ? AND umbrella_number = ? 
          AND (start_date <= ? AND end_date >= ?)
        `).get(b.row_number, b.umbrella_number, b.end_date, b.start_date);

        if (existing) {
          return res.status(400).json({ 
            error: `Ombrellone N.${b.umbrella_number * 10 + b.row_number} già prenotato per queste date` 
          });
        }
      }
    }


    const insertBooking = db.prepare(`
      INSERT INTO bookings (row_number, umbrella_number, zone_id, quantity, start_date, end_date, user_name, user_email, user_phone, total_price, is_paid, payment_method)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `);

    const insertService = db.prepare(`
      INSERT INTO booking_services (booking_id, service_type, quantity)
      VALUES (?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      const bookingIds = [];
      for (const b of bookingsData) {
        const info = insertBooking.run(
          b.row_number,
          b.umbrella_number,
          b.zone_id ?? null,
          b.quantity ?? 1,
          b.start_date,
          b.end_date,
          b.user_name,
          b.user_email,
          b.user_phone,
          b.total_price,
          b.payment_method ?? 'online'
        );
        const bookingId = info.lastInsertRowid;
        bookingIds.push(bookingId);

        if (b.services) {
          for (const service of b.services) {
            if (service.quantity > 0) {
              insertService.run(bookingId, service.type, service.quantity);
            }
          }
        }
      }
      return bookingIds;
    });

    try {
      const bookingIds = transaction();
      res.json({ success: true, bookingIds });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  });

  // Mark booking as paid (cassa payment confirmation)
  app.put('/api/bookings/:id/pay', (req, res) => {
    const { id } = req.params;
    db.prepare('UPDATE bookings SET is_paid = 1 WHERE id = ?').run(id);
    res.json({ success: true });
  });

  // Mark booking as checked-in (customer arrived at the beach)
  app.put('/api/bookings/:id/checkin', (req, res) => {
    const { id } = req.params;
    db.prepare('UPDATE bookings SET checked_in = 1 WHERE id = ?').run(id);
    res.json({ success: true });
  });

  // Delete booking
  app.delete('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    db.transaction(() => {
      db.prepare('DELETE FROM booking_services WHERE booking_id = ?').run(id);
      db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
    })();
    res.json({ success: true });
  });

  // Get bookings by email or phone (for "Le mie prenotazioni" feature)
  app.get('/api/my-bookings', (req, res) => {
    const { email, phone } = req.query;
    if (!email && !phone) {
      return res.status(400).json({ error: 'Inserisci email o numero di telefono' });
    }
    let query = 'SELECT * FROM bookings WHERE 1=0';
    const params: any[] = [];
    if (email) {
      query = 'SELECT * FROM bookings WHERE LOWER(user_email) = LOWER(?)';
      params.push(email);
    } else if (phone) {
      // Match on the last digits to handle prefix variations (+39 333... vs 333...)
      const digits = String(phone).replace(/\D/g, '').slice(-9);
      query = `SELECT * FROM bookings WHERE REPLACE(REPLACE(REPLACE(user_phone,' ',''),'-',''),'+','') LIKE ?`;
      params.push(`%${digits}`);
    }
    query += ' ORDER BY start_date DESC';
    const bookings = db.prepare(query).all(...params);
    const bookingsWithServices = bookings.map((b: any) => {
      const services = db.prepare('SELECT service_type as type, quantity FROM booking_services WHERE booking_id = ?').all(b.id);
      return { ...b, services, is_paid: !!b.is_paid, checked_in: !!b.checked_in };
    });
    res.json(bookingsWithServices);
  });



  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

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
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    total_price REAL NOT NULL,
    is_paid BOOLEAN NOT NULL DEFAULT 0,
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/bookings', (req, res) => {
    const { startDate, endDate } = req.query;
    let query = 'SELECT * FROM bookings';
    const params: any[] = [];

    if (startDate && endDate) {
      query += ' WHERE (start_date <= ? AND end_date >= ?)';
      params.push(endDate, startDate);
    }

    const bookings = db.prepare(query).all(...params);
    
    const bookingsWithServices = bookings.map((b: any) => {
      const services = db.prepare('SELECT * FROM booking_services WHERE booking_id = ?').all(b.id);
      return { ...b, services };
    });

    res.json(bookingsWithServices);
  });

  app.post('/api/bookings', (req, res) => {
    const bookingsData = Array.isArray(req.body) ? req.body : [req.body];

    // Check availability
    for (const b of bookingsData) {
      const existing = db.prepare(`
        SELECT id FROM bookings 
        WHERE row_number = ? AND umbrella_number = ? 
        AND (start_date <= ? AND end_date >= ?)
      `).get(b.row_number, b.umbrella_number, b.end_date, b.start_date);

      if (existing) {
        return res.status(400).json({ error: `Postazione ${b.row_number === 0 ? 'Riva ' + b.umbrella_number : b.umbrella_number * 10 + b.row_number} già prenotata per queste date` });
      }
    }

    const insertBooking = db.prepare(`
      INSERT INTO bookings (row_number, umbrella_number, start_date, end_date, user_name, user_email, user_phone, total_price, is_paid)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);

    const insertService = db.prepare(`
      INSERT INTO booking_services (booking_id, service_type, quantity)
      VALUES (?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      const bookingIds = [];
      for (const b of bookingsData) {
        const info = insertBooking.run(b.row_number, b.umbrella_number, b.start_date, b.end_date, b.user_name, b.user_email, b.user_phone, b.total_price);
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

  app.put('/api/bookings/:id/pay', (req, res) => {
    const { id } = req.params;
    db.prepare('UPDATE bookings SET is_paid = 1 WHERE id = ?').run(id);
    res.json({ success: true });
  });

  app.delete('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    db.transaction(() => {
      db.prepare('DELETE FROM booking_services WHERE booking_id = ?').run(id);
      db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
    })();
    res.json({ success: true });
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

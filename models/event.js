// ...existing code...
import db from '../db.js';

// Create a new event
export async function createEvent(eventData) {
  const now = new Date().toISOString();
  const event = {
    id: Date.now().toString(),
    userId: eventData.userId,
    title: eventData.title,
    description: eventData.description || '',
    address: eventData.address || '',
    date: eventData.date,
    createdAt: now,
    updatedAt: now
  };

  const stmt = db.prepare(`
    INSERT INTO events (id, userId, title, description, address, date, createdAt, updatedAt)
    VALUES (@id, @userId, @title, @description, @address, @date, @createdAt, @updatedAt)
  `);
  stmt.run(event);
  return event;
}

// Get a single event by id
export function getEventById(id) {
  const stmt = db.prepare(`SELECT * FROM events WHERE id = ?`);
  return stmt.get(id) || null;
}

// Get all events, newest first
export function getAllEvents() {
  const stmt = db.prepare(`SELECT * FROM events ORDER BY createdAt DESC`);
  return stmt.all();
}

// Update an event (partial or full)
export function updateEvent(id, updateData) {
  const existing = getEventById(id);
  if (!existing) return null;

  const updated = {
    ...existing,
    ...updateData,
    updatedAt: new Date().toISOString()
  };

  const stmt = db.prepare(`
    UPDATE events
    SET title = @title,
        description = @description,
        address = @address,
        date = @date,
        createdAt = @createdAt,
        updatedAt = @updatedAt
    WHERE id = @id
  `);
  stmt.run(updated);
  return updated;
}

// Delete an event by id
export function deleteEvent(id) {
  const existing = getEventById(id);
  if (!existing) return null;

  const stmt = db.prepare(`DELETE FROM events WHERE id = ?`);
  stmt.run(id);
  return existing;
}

export function registerUserForEvent(eventId, userId, createdAt) {
  const stmt = db.prepare(`
    INSERT INTO registrations (eventId, userId, createdAt)
    VALUES (?, ?, ?)
  `);
  stmt.run(eventId, userId, createdAt);
}

export function unregisterUserFromEvent(eventId, userId) {
  const stmt = db.prepare(`
    DELETE FROM registrations
    WHERE eventId = ? AND userId = ?
  `);
  stmt.run(eventId, userId);
}
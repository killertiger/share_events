// /Users/killertiger/development/udemy_share_events/models/User.js
import db from '../db.js';

import bcrypt from 'bcryptjs';

// Keep TEXT ids to match existing controller expectations
export async function createUser(userData) {
  const now = new Date().toISOString();
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = {
    id: Date.now().toString(),
    email: userData.email,
    password: hashedPassword,
    name: userData.name,
    createdAt: now,
    updatedAt: now
  };

  const stmt = db.prepare(`
    INSERT INTO users (id, email, password, name, createdAt, updatedAt)
    VALUES (@id, @email, @password, @name, @createdAt, @updatedAt)
  `);
  stmt.run(user);
  return user;
}

export async function verifyUserCredentials(email, password) {
  const user = findUserByEmail(email);
  if (!user) {
    return null;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }
  return user;
}


export function findUserByEmail(email) {
  const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
  return stmt.get(email) || null;
}

export function findUserById(id) {
  const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
  return stmt.get(id) || null;
}

export function getAllUsers() {
  const stmt = db.prepare(`SELECT * FROM users ORDER BY createdAt DESC`);
  return stmt.all();
}

export function updateUser(id, updateData) {
  const existing = findUserById(id);
  if (!existing) return null;

  const updated = {
    ...existing,
    ...updateData,
    updatedAt: new Date().toISOString()
  };

  const stmt = db.prepare(`
    UPDATE users
    SET email = @email,
        password = @password,
        name = @name,
        createdAt = @createdAt,
        updatedAt = @updatedAt
    WHERE id = @id
  `);
  stmt.run(updated);
  return updated;
}

export function deleteUser(id) {
  const existing = findUserById(id);
  if (!existing) return null;

  const stmt = db.prepare(`DELETE FROM users WHERE id = ?`);
  stmt.run(id);
  return existing;
}
import * as eventModel from '../models/event.js';

// filepath: /Users/killertiger/development/udemy_share_events/controllers/events-controllers.js

// Create a new event
export async function create(req, res) {
    const { title, description, address, date } = req.body || {};

    // Helper to check for non-empty, non-whitespace strings
    function isValidString(str) {
        return typeof str === 'string' && str.trim().length > 0;
    }

    if (
        !isValidString(title) ||
        !isValidString(description) ||
        !isValidString(address) ||
        !isValidString(date)
    ) {
        return res.status(400).json({ error: 'title, description, address, and date are required and must not be empty' });
    }

    // Optionally, validate date format (ISO 8601)
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ error: 'date must be a valid date string' });
    }

    try {
        const event = await eventModel.createEvent({ title, description, address, date });
        return res.status(201).json(event);
    } catch (err) {
        return res.status(500).json({ error: err?.message || 'Failed to create event' });
    }
}

// Get one event by id
export function get(req, res) {
    const { id } = req.params;
    try {
        const event = eventModel.getEventById(id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        return res.json(event);
    } catch (err) {
        return res.status(500).json({ error: err?.message || 'Failed to fetch event' });
    }
}

// Get all events
export function getAll(req, res) {
    try {
        const events = eventModel.getAllEvents();
        return res.json(events);
    } catch (err) {
        return res.status(500).json({ error: err?.message || 'Failed to fetch events' });
    }
}

// Update an event (partial or full)
export function update(req, res) {
    const { id } = req.params;
    const updateData = req.body || {};

    // Only allow updating these fields
    const allowedFields = ['title', 'description', 'address', 'date'];
    const updates = {};

    // Helper to check for non-empty, non-whitespace strings
    function isValidString(str) {
        return typeof str === 'string' && str.trim().length > 0;
    }

    for (const key of allowedFields) {
        if (updateData.hasOwnProperty(key)) {
            if (key === 'date') {
                const dateObj = new Date(updateData.date);
                if (isNaN(dateObj.getTime())) {
                    return res.status(400).json({ error: 'date must be a valid date string' });
                }
                updates.date = updateData.date;
            } else {
                if (!isValidString(updateData[key])) {
                    return res.status(400).json({ error: `${key} must not be empty` });
                }
                updates[key] = updateData[key];
            }
        }
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
    }

    try {
        const updated = eventModel.updateEvent(id, updates);
        if (!updated) return res.status(404).json({ error: 'Event not found' });
        return res.json(updated);
    } catch (err) {
        return res.status(500).json({ error: err?.message || 'Failed to update event' });
    }
}

// Delete an event by id
export function deleteItem(req, res) {
    const { id } = req.params;
    try {
        const deleted = eventModel.deleteEvent(id);
        if (!deleted) return res.status(404).json({ error: 'Event not found' });
        return res.json(deleted);
    } catch (err) {
        return res.status(500).json({ error: err?.message || 'Failed to delete event' });
    }
}
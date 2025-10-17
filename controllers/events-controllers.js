import * as eventModel from '../models/event.js';

// filepath: /Users/killertiger/development/udemy_share_events/controllers/events-controllers.js

// Create a new event
export async function create(req, res) {
    const { title, description, address, date } = req.body || {};

    if (!title || !date) {
        return res.status(400).json({ error: 'title and date are required' });
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

    try {
        const updated = eventModel.updateEvent(id, updateData);
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
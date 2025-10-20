import express from "express";
import * as eventController from "../controllers/events-controllers.js";
import { authenticate } from "../util/auth.js";

const router = express.Router();

// ensure JSON body parsing for routes defined here
router.use(express.json());

// create a new event
// POST /events
// body: { title, date, location, description }
router.post("/", authenticate, eventController.create);

// edit an existing event (partial update)
// PUT /events/:id
// body: any of { title, date, location, description }
router.put("/:id", authenticate, eventController.update);

// delete an event
// DELETE /events/:id
router.delete("/:id", authenticate, eventController.deleteItem);

// get all events
// GET /events
router.get("/", eventController.getAll);

// get one event
// GET /events/:id
router.get("/:id", eventController.get);

router.post('/:id/register', authenticate, eventController.registerForEvent);

router.post('/:id/unregister', authenticate, eventController.unregisterFromEvent);

export default router;

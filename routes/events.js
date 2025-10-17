import express from "express";
import * as eventController from "../controllers/events-controllers.js";

const router = express.Router();

// ensure JSON body parsing for routes defined here
router.use(express.json());

// create a new event
// POST /events
// body: { title, date, location, description }
router.post("/", eventController.create);

// get all events
// GET /events
router.get("/", eventController.getAll);

// get one event
// GET /events/:id
router.get("/:id", eventController.get);

// edit an existing event (partial update)
// PUT /events/:id
// body: any of { title, date, location, description }
router.put("/:id", eventController.update);

// delete an event
// DELETE /events/:id
router.delete("/:id", eventController.deleteItem);

export default router;

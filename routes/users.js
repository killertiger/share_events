// /Users/killertiger/development/udemy_share_events/routes/users.js
import express from 'express';
import { signup, login } from '../controllers/user-controllers.js';

const router = express.Router();

// User signup route
router.post('/signup', signup);

// User login route
router.post('/login', login);

export default router;
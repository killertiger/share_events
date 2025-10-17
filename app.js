// /Users/killertiger/development/udemy_share_events/app.js
import express from 'express';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import { initializeDatabase } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/users', userRoutes);
app.use('/events', eventRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Share Events REST API',
    version: '1.0.0',
    endpoints: {
      users: {
        signup: 'POST /users/signup',
        login: 'POST /users/login'
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  try{
    initializeDatabase();
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
});
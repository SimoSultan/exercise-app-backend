import 'dotenv/config'; // Import and configure dotenv

import passport from 'passport';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import ConnectPg from 'connect-pg-simple';

import db from './database/connect.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/users.js';
import exerciseRouter from './routes/exercises.js';
import entriesRoutes from './routes/entries.js';
import leaderboardRouter from './routes/leaderboard.js';

const PgStore = ConnectPg(session);

const allowedOrigins = [process.env.FRONTEND_ORIGIN];

// Use middlewares.
const app = express();
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.set('trust proxy', 1);

const cookie = {
  sameSite: 'none',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24 * 7, // one week
  httpOnly: true,
};

app.use(
  session({
    store: new PgStore({
      // Use PgStore
      pool: db, // Connection pool
      tableName: 'user_sessions', // Optional table name
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    ...(process.env.NODE_ENV === 'production' && cookie),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Sub routes.
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/exercises', exerciseRouter);
app.use('/entries', entriesRoutes);
app.use('/leaderboard', leaderboardRouter);

async function startServer() {
  try {
    app.get('/', (req, res) => {
      if (process.env.NODE_ENV === 'development') {
        res.send('Hello from Sixty6 Backend!');
      } else {
        res.send('Hello from Vercel Backend!');
      }
    });
  } catch (error) {
    console.error('Error during server startup:', error);
    process.exit(1); // Important: Exit the process on error
  }
}

startServer();

export default app;

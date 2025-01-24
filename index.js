require("dotenv").config();
const passport = require("passport");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const PgStore = require("connect-pg-simple")(session);
const db = require("./database/connect");

const allowedOrigins = [process.env.FRONTEND_ORIGIN];
if (process.env.NODE_ENV === "development") {
  allowedOrigins.push("http://localhost:5000");
}

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
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.set("trust proxy", 1);

app.use(
  session({
    store: new PgStore({
      // Use PgStore
      pool: db, // Connection pool
      tableName: "user_sessions", // Optional table name
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // one week
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Sub routes.
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/exercises", require("./routes/exercises"));
app.use("/entries", require("./routes/entries"));
app.use("/leaderboard", require("./routes/leaderboard"));

async function startServer() {
  try {
    app.get("/", (req, res) => {
      if (process.env.NODE_ENV === "development") {
        res.send("Hello from Sixty6 Backend!");
      } else {
        res.send("Hello from Vercel Backend!");
      }
    });
  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1); // Important: Exit the process on error
  }
}

startServer();
module.exports = app;

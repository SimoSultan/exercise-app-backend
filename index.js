require("dotenv").config();
const passport = require("passport");
const express = require("express");
const session = require("express-session");
const cors = require("cors");

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");

// Use middlewares.
const app = express();
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
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
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    ...(process.env.NODE_ENV === "production" && {
      cookie: {
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // one week
      },
    }),
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

function startServer() {
  try {
    console.log("Database connection successful!");
    app.get("/", (req, res) => {
      res.send("Hello from Sixty6 Backend!");
    });
  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1); // Important: Exit the process on error
  }
}

startServer();
module.exports = app;

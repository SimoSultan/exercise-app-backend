require("dotenv").config();
const passport = require("passport");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const port = process.env.PORT || 3000;

// Use middlewares.
const app = express();
app.use(passport.initialize());

app.use(express.json());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_ORIGIN,
      ...(process.env.ALLOWED_ORIGINS || "").split(","),
    ],
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
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/exercises", require("./routes/exercises"));
app.use("/entries", require("./routes/entries"));
app.use("/leaderboard", require("./routes/leaderboard"));

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

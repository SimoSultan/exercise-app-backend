const express = require("express");
const authRouter = express.Router();
const passport = require("passport");

require("../middleware/login-google");

// Log in with Google.
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),

  (req, res) => {
    // Successful authentication
    req.login(req.user, (err) => {
      if (err) {
        console.error("Error creating session:", err);
        return res.redirect("/login"); // Redirect on session error
      }
      // Successful login, redirect to the desired page
      console.log("am I authenticated? ", req.isAuthenticated());
      console.log("user:", req.user);

      res.redirect(process.env.FRONTEND_ORIGIN);
    });
  }
);

// Page to redirect to if login fails.
authRouter.get("/failure", (req, res) => {
  // return res.send(
  //   `<div>Couldn't log you in. <a href="${process.env.FRONTEND_ORIGIN}">Back to home</a></div>`
  // );
  res.redirect(`${process.env.FRONTEND_ORIGIN}/failure`);
});

// Log out the user.
authRouter.get("/logout", (req, res) => {
  return req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.end();
  });
});

module.exports = authRouter;

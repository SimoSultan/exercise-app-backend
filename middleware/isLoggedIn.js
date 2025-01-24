function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("user is authed ", req.user);
  }

  req.isAuthenticated() ? next() : res.sendStatus(401);
}

module.exports = isLoggedIn;

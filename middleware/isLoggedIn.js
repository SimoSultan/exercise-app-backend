export const isLoggedIn = async (req, res, next) => {
  req.isAuthenticated() ? next() : res.sendStatus(401);
};

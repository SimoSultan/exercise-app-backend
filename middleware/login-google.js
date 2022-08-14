const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const {
  findUserByUsername,
  createUser,
  createRoutine,
} = require("../database/queries");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.THIS_ORIGIN}/auth/google/callback`,
      passReqToCallback: true,
    },
    async function (_, _, _, profile, done) {
      try {
        let user = await findUserByUsername(profile.email);
        if (user) {
          return done(null, user);
        }
        // No existing user found, create them.
        return done(
          null,
          await handleSignup(
            profile.email,
            profile.given_name,
            profile.family_name
          )
        );
      } catch (e) {
        console.error(e)
        done(e, null);
      }
    }
  )
);

// Choose which parts of the user we want to store into the session.
passport.serializeUser(function (user, done) {
  done(null, {
    id: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
  });
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Create the user and also a default routine for them to use.
async function handleSignup(email, firstName, lastName) {
  const user = await createUser(email, firstName, lastName)
  await createRoutine(user.id, `${firstName} ${lastName}'s Routine`)
  return user
}
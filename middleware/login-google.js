import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import {
  findUserByUsername,
  createUser,
  updateUser,
} from '../database/queries/users.js';
import { createRoutine } from '../database/queries/routines.js';

// Create the user and also a default routine for them to use.
async function handleSignup(email, firstName, lastName, picture = null) {
  const user = await createUser(email, firstName, lastName, picture);
  const routine = await createRoutine(
    user.id,
    `${firstName} ${lastName}'s Routine`,
  );
  return { ...user, routine_id: routine.id };
}

const options = {
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: '/auth/google/callback',
};

const verify = async (_accessToken, __refreshToken, profile, cb) => {
  try {
    let user = await findUserByUsername(profile.emails[0].value);

    if (profile.emails[0].value && !user) {
      // No existing user found, create them.
      return cb(
        null,
        await handleSignup(
          profile.emails[0].value,
          profile.name.givenName,
          profile.name.familyName,
          profile.photos?.[0]?.value,
        ),
      );
    }

    // Updates users profile picture if it doesn't exist but is returned from Google.
    if (profile.photos?.[0]?.value && !user?.picture) {
      user = await updateUser(user.id, {
        picture: profile.photos?.[0]?.value ?? '',
      });
    }

    return cb(null, user);
  } catch (e) {
    console.error(e);
    return cb(e, null);
  }
};

passport.use(new GoogleStrategy(options, verify));

// Choose which parts of the user we want to store into the session.
passport.serializeUser((user, done) => {
  return done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  try {
    let user = await findUserByUsername(username);
    if (user.username) {
      done(null, user); // Return the full user object
    } else {
      done(null, false); // User not found
    }
  } catch (err) {
    done(err); // Handle database errors
  }
});

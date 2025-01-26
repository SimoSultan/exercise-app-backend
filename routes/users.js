import express from 'express';

import {
  findUserByUsername,
  getUser,
  listUsers,
  updateUser,
} from '../database/queries/users.js';
import { isLoggedIn } from '../middleware/isLoggedIn.js';

const userRouter = express.Router();

// Lists all users.
// TODO: This was only intended as a test endpoint, we shouldn't just be returning all the rows.
userRouter.get('/list', isLoggedIn, async (req, res) => {
  try {
    const users = await listUsers();
    if (users.length === 0) {
      return res.status(404).send('no users found');
    }
    return res.send(users);
  } catch (e) {
    console.error(e);
    return res.status(500).send('failed to fetch users');
  }
});

// Returns the current logged in user.
userRouter.get('/current', isLoggedIn, async (req, res) => {
  try {
    let user = await findUserByUsername(req.user.username);
    if (user) {
      return res.send({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        routineId: user.routine_id,
        username: user.username,
        picture: user.picture,
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(404).send('user not found');
  }
});

userRouter.post('/get', isLoggedIn, async (req, res) => {
  // Validate.
  const { id } = req.body;
  if (!id) {
    return res.status(400).send('id is required');
  }
  // Fetch record.
  try {
    const user = await getUser(id);
    if (!user) {
      return res.status(404).send('user not found');
    }
    return res.send(user);
  } catch (e) {
    console.error(e);
    return res.status(500).send('failed to fetch user');
  }
});

userRouter.post('/update', isLoggedIn, async (req, res) => {
  // Validate.
  const { id, firstName, lastName, picture } = req.body;
  if (!id) {
    return res.status(400).send('id is required');
  }
  if (!firstName && !lastName && !picture) {
    return res
      .status(400)
      .send('require at least one of firstName, lastName or picture');
  }
  // Update record.
  try {
    const entry = await updateUser(id, {
      first_name: firstName,
      last_name: lastName,
      picture: picture,
    });
    return res.send(entry);
  } catch (e) {
    console.error(e);
    return res.status(500).send('failed to update entry');
  }
});

export default userRouter;

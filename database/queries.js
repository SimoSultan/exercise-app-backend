const db = require('./connect')

// Users.
async function findUserByUsername(username) {
  const res = await db.query(`
    SELECT
      id,
      username,
      first_name,
      last_name
    FROM users
    WHERE username=$1
  `, [username])
  return res.rows[0]
}

async function createUser(username, firstName, lastName) {
  const res = await db.query(`
    INSERT INTO users(username, first_name, last_name)
    VALUES($1, $2, $3)
    RETURNING id, username, first_name, last_name
  `, [username, firstName, lastName]) 
  if (!res.rows[0]) {
    throw new Error('expected a user to be created')
  }
  return res.rows[0]
}

// Routines. 
// Note: For MVP we probably won't support multiple routines.
async function createRoutine(ownerUserId, name) {
  const res = await db.query(`
    INSERT INTO routines (owner_user_id, name)
    VALUES ($1, $2)
    RETURNING id, created_at, owner_user_id, name
  `, [ownerUserId, name])
  if (!res.rows[0]) {
    throw new Error('expected a routine to be created')
  }
  return res.rows[0]
}

// Exercises.
async function createExercise(routineId, name, amount, unit, order) {
  const res = await db.query(`
    INSERT INTO exercises (routine_id, name, amount, unit, "order")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, routine_id, name, amount, unit, "order", created_at
  `, [routineId, name, amount, unit, order])
  if (!res.rows[0]) {
    throw new Error('expected a exercise to be created')
  }
  return res.rows[0]
}

async function listExercises(routineId) {
  const res = await db.query(`
    SELECT id, routine_id, name, amount, unit, "order", created_at
    FROM exercises
    WHERE routine_id=$1
  `, [routineId])
  return res.rows
}

module.exports = {
  findUserByUsername,
  createUser,
  createRoutine,
  createExercise,
  listExercises,
}

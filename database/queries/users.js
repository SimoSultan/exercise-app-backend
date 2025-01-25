const db = require('../connect');
const { buildUpdateQueryBase } = require('./helpers');

async function findUserByUsername(username, picture) {
  const res = await db.query(
    `
    SELECT
      u.id,
      u.username,
      u.first_name,
      u.last_name,
      u.picture,
      r.id AS routine_id
    FROM users AS u
    INNER JOIN routines as r
      ON r.owner_user_id=u.id
    WHERE username=$1
  `,
    [username],
  );
  return res.rows[0];
}

async function createUser(username, firstName, lastName, picture) {
  const res = await db.query(
    `
    INSERT INTO users(username, first_name, last_name, picture)
    VALUES($1, $2, $3, $4)
    RETURNING id, username, first_name, last_name, picture
  `,
    [username, firstName, lastName, picture],
  );
  if (!res.rows[0]) {
    throw new Error('expected a user to be created');
  }
  return res.rows[0];
}

async function getUser(id) {
  const res = await db.query(
    `
    SELECT
      u.id,
      u.username,
      u.first_name,
      u.last_name,
      u.picture,
      r.id AS routine_id
    FROM users AS u
    INNER JOIN routines as r
      ON r.owner_user_id=u.id
    WHERE u.id=$1
  `,
    [id],
  );
  return res.rows[0];
}

async function listUsers() {
  const res = await db.query(`
    SELECT
      u.id,
      u.username,
      u.first_name,
      u.last_name,
      u.picture,
      r.id AS routine_id
    FROM users AS u
    INNER JOIN routines as r
      ON r.owner_user_id=u.id
  `);
  return res.rows;
}

async function updateUser(id, updates) {
  const validUpdates = Object.keys(updates).reduce((acc, columnName) => {
    const newValue = updates[columnName];
    if (!newValue) {
      return acc;
    }
    return { ...acc, [columnName]: newValue };
  }, {});
  const newValues = Object.values(validUpdates);
  const res = await db.query(
    `
    ${buildUpdateQueryBase('users', validUpdates)}
    WHERE id = $${newValues.length + 1}
    RETURNING id, username, first_name, last_name, picture
  `,
    [...newValues, id],
  );
  if (!res.rows[0]) {
    throw new Error('expected a user to be updated');
  }
  return res.rows[0];
}

module.exports = {
  findUserByUsername,
  createUser,
  getUser,
  listUsers,
  updateUser,
};

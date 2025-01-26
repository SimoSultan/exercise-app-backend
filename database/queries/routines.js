import db from '../connect.js';

// Note: For MVP we probably won't support multiple routines.
export const createRoutine = async (ownerUserId, name) => {
  const res = await db.query(
    `
    INSERT INTO routines (owner_user_id, name)
    VALUES ($1, $2)
    RETURNING id, created_at, owner_user_id, name
  `,
    [ownerUserId, name],
  );
  if (!res.rows[0]) {
    throw new Error('expected a routine to be created');
  }
  return res.rows[0];
};

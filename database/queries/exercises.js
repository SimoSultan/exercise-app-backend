const db = require('../connect');
const { buildUpdateQueryBase } = require('./helpers');

async function createExercise(routineId, name, amount, unit, order) {
  const res = await db.query(
    `
    INSERT INTO exercises (routine_id, name, amount, unit, "order")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, routine_id, name, amount, unit, "order", created_at
  `,
    [routineId, name, amount, unit, order],
  );
  if (!res.rows[0]) {
    throw new Error('expected a exercise to be created');
  }
  return res.rows[0];
}

async function listExercises(routineId) {
  const res = await db.query(
    `
    SELECT id, routine_id, name, amount, unit, "order", created_at
    FROM exercises
    WHERE routine_id=$1
  `,
    [routineId],
  );
  return res.rows;
}

async function getExercise(id) {
  const res = await db.query(
    `
    SELECT id, routine_id, name, amount, unit, "order", created_at
    FROM exercises
    WHERE id=$1
  `,
    [id],
  );
  return res.rows[0];
}

// `updates` should be { column1Name: newValue1, column2Name: newValue2... }
async function updateExercise(id, updates) {
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
    ${buildUpdateQueryBase('exercises', validUpdates)}
    WHERE id=$${newValues.length + 1}
    RETURNING id, routine_id, name, amount, unit, "order", created_at
  `,
    [...newValues, id],
  );
  if (!res.rows[0]) {
    throw new Error('expected an exercise to be updated');
  }
  return res.rows[0];
}

async function deleteExercise(id) {
  const res = await db.query('DELETE FROM exercises WHERE id=$1', [id]);
  return res.rowCount;
}

module.exports = {
  createExercise,
  listExercises,
  getExercise,
  updateExercise,
  deleteExercise,
};

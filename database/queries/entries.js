import db from '../connect.js';

export const createEntry = async (
  exerciseId,
  amount,
  createdAt,
  completedAt,
) => {
  let columnNames = 'exercise_id, amount, created_at';
  let values = '$1, $2, $3';
  let args = [exerciseId, amount, createdAt];
  if (completedAt) {
    columnNames += ', completed_at';
    values += ', $4';
    args.push(completedAt);
  }
  const res = await db.query(
    `
    INSERT INTO entries (${columnNames})
    VALUES (${values})
    RETURNING id, exercise_id, amount, created_at, completed_at
  `,
    args,
  );
  if (!res.rows[0]) {
    throw new Error('expected an entry to be created');
  }
  return res.rows[0];
};

export const listEntries = async (exerciseId) => {
  const res = await db.query(
    `
    SELECT id, exercise_id, amount, created_at, completed_at
    FROM entries
    WHERE exercise_id=$1
  `,
    [exerciseId],
  );
  return res.rows;
};

export const listEntriesPerExerciseOnDate = async (
  exerciseId,
  fromDate,
  toDate,
) => {
  const res = await db.query(
    `
    SELECT id, exercise_id, amount, created_at, completed_at
    FROM entries
    WHERE exercise_id=$1
    AND completed_at BETWEEN $2 AND $3
  `,
    [exerciseId, fromDate, toDate],
  );
  return res.rows;
};

export const listEntriesAllExercisesOnDate = async (
  exerciseIds,
  fromDate,
  toDate,
) => {
  // TODO: fix
  const ids = exerciseIds.split(', ');
  console.log(ids);
  const res = await db.query(
    `
    SELECT id, exercise_id, amount, created_at, completed_at
    FROM entries
    WHERE exercise_id IN (SELECT * FROM STRING_SPLIT($1, ','))
    AND completed_at BETWEEN $2 AND $3
  `,
    [exerciseIds, fromDate, toDate],
  );
  return res.rows;
};

export const updateEntry = async (id, amount) => {
  // TODO: Support `created_at`.
  const res = await db.query(
    `
    UPDATE entries
    SET amount=$2
    WHERE id=$1
    RETURNING id, exercise_id, amount, created_at, completed_at
  `,
    [id, amount],
  );
  if (!res.rows[0]) {
    throw new Error('expected an entry to be updated');
  }
  return res.rows[0];
};

export const deleteEntry = async (id) => {
  const res = await db.query('DELETE FROM entries WHERE id=$1', [id]);
  return res.rowCount;
};

import db from '../connect.js';

export const getDailyLeaderboardData = async (fromDate, toDate) => {
  let { rows: leaderboardData } = await db.query(
    `
    SELECT
      u2.id as user_id,
      u2.first_name,
      u2.last_name,
      u2.picture,
      t.entry_amount,
      t.exercise_id,
      t.exercise_amount
    FROM users as u2
    LEFT JOIN (
      SELECT
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.picture,
        SUM(en.amount) AS entry_amount,
        ex.id AS exercise_id,
        ex.amount AS exercise_amount
      FROM entries AS en
      INNER JOIN exercises AS ex
        ON en.exercise_id = ex.id
      INNER JOIN routines AS r 
        ON ex.routine_id = r.id
      INNER JOIN users AS u
        ON r.owner_user_id = u.id
      WHERE en.completed_at BETWEEN $1 AND $2
      GROUP BY ex.id, u.id
    ) AS t ON u2.id = t.user_id
  `,
    [fromDate, toDate],
  );
  const exerciseCounts = await getExerciseCounts();
  // Append the exercise counts to the entries, as we need this to calculate the
  // final percentages.
  leaderboardData = leaderboardData.map((entry) => {
    const totalExercises =
      exerciseCounts.find(({ user_id }) => entry.user_id == user_id)
        ?.total_exercises || 0;
    return Object.assign(entry, { totalExercises });
  });
  return leaderboardData;
};

export const getUserLeaderboardData = async (fromDate, toDate, userId) => {
  let { rows: leaderboardData } = await db.query(
    `
    SELECT
      u2.id as user_id,
      u2.first_name,
      u2.last_name,
      u2.picture,
      t.entry_amount,
      t.exercise_id,
      t.exercise_amount
    FROM users as u2
    LEFT JOIN (
      SELECT
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.picture,
        SUM(en.amount) AS entry_amount,
        ex.id AS exercise_id,
        ex.amount AS exercise_amount
      FROM entries AS en
      INNER JOIN exercises AS ex
        ON en.exercise_id = ex.id
      INNER JOIN routines AS r 
        ON ex.routine_id = r.id
      INNER JOIN users AS u
        ON r.owner_user_id = u.id
      WHERE en.completed_at BETWEEN $1 AND $2
      WHERE u.id=$3
      GROUP BY ex.id, u.id
    ) AS t ON u2.id = t.user_id
  `,
    [fromDate, toDate, userId],
  );
  const exerciseCounts = await getExerciseCounts();
  // Append the exercise counts to the entries, as we need this to calculate the
  // final percentages.
  leaderboardData = leaderboardData.map((entry) => {
    const totalExercises =
      exerciseCounts.find(({ user_id }) => entry.user_id == user_id)
        ?.total_exercises || 0;
    return Object.assign(entry, { totalExercises });
  });
  return leaderboardData;
};

export const getExerciseCounts = async () => {
  const res = await db.query(`
    SELECT
      u.id AS user_id,
      COUNT(e.id) AS total_exercises
    FROM users AS u
    INNER JOIN routines AS r
      ON r.owner_user_id = u.id 
    INNER join exercises AS e
      ON e.routine_id = r.id
    GROUP BY u.id
  `);
  return res.rows;
};

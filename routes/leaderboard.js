import express from 'express';

import { getDailyLeaderboardData } from '../database/queries/leaderboard.js';
import { getEndOfDayFromDate, getStartOfDayFromDate } from '../utils/utils.js';

const leaderboardRouter = express.Router();

leaderboardRouter.post('/', async (req, res) => {
  const { from, to } = req.body;

  if (!from) {
    return res.status(400).send('from day is required');
  }

  if (!to) {
    return res.status(400).send('to day is required');
  }

  // Get the start and end of the day, and pass those in as the time range.
  const start = getStartOfDayFromDate(from);
  const end = getEndOfDayFromDate(to);

  let leaderboardData = await getDailyLeaderboardData(start, end);
  // Calculate the percentages and strip the data we don't need.
  const leaderboardPercentages = leaderboardData.reduce((acc, entry) => {
    const exercisePercentage = calculateExercisePercentage(entry);
    if (!acc[entry.user_id]) {
      acc[entry.user_id] = {
        userId: entry.user_id,
        firstName: entry.first_name,
        lastName: entry.last_name,
        percentage: exercisePercentage,
        picture: entry.picture,
      };
      return acc;
    }
    acc[entry.user_id].percentage += exercisePercentage;
    return acc;
  }, {});
  res.json(leaderboardPercentages);
});

leaderboardRouter.post('/user', async (req, res) => {
  const { from, to, userId } = req.body;

  if (!from) {
    return res.status(400).send('from day is required');
  }

  if (!to) {
    return res.status(400).send('to day is required');
  }

  if (!userId) {
    return res.status(400).send('userId is required');
  }

  // Get the start and end of the day, and pass those in as the time range.
  const start = getStartOfDayFromDate(from);
  const end = getEndOfDayFromDate(to);

  let leaderboardData = await getDailyLeaderboardData(start, end, userId);
  // Calculate the percentages and strip the data we don't need.
  const leaderboardPercentages = leaderboardData.reduce((acc, entry) => {
    const exercisePercentage = calculateExercisePercentage(entry);
    if (!acc[entry.user_id]) {
      acc[entry.user_id] = {
        userId: entry.user_id,
        firstName: entry.first_name,
        lastName: entry.last_name,
        percentage: exercisePercentage,
        picture: entry.picture,
      };
      return acc;
    }
    acc[entry.user_id].percentage += exercisePercentage;
    return acc;
  }, {});
  res.json(leaderboardPercentages);
});

function calculateExercisePercentage(entry) {
  if (!entry.entry_amount || !entry.exercise_amount) {
    return 0;
  }

  return entry.entry_amount / entry.exercise_amount / entry.totalExercises;
}

export default leaderboardRouter;

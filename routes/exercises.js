const express = require('express');
const {
  createExercise,
  listExercises,
  getExercise,
  updateExercise,
  deleteExercise,
} = require('../database/queries/exercises');
const exerciseRouter = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');

// Create a new exercise.
exerciseRouter.post('/create', isLoggedIn, async (req, res) => {
  // Validate.
  let { routineId, name, amount, unit, order } = req.body;
  if (!routineId) {
    return res.status(400).send('routineId is required');
  }
  if (!name) {
    return res.status(400).send('name is required');
  }
  if (!amount) {
    return res.status(400).send('amount is required');
  }
  if (!order) {
    return res.status(400).send('order is required');
  }
  if (!unit) {
    unit = 'reps';
  }
  // Create record.
  try {
    const ex = await createExercise(routineId, name, amount, unit, order);
    return res.send(ex);
  } catch (e) {
    console.error(e);
    return res.status(500).send('failed to create exercise');
  }
});

// List exercises by their routine.
exerciseRouter.post('/list', isLoggedIn, async (req, res) => {
  // Validate.
  const { routineId } = req.body;
  if (!routineId) {
    return res.status(400).send('routineId is required');
  }
  // Fetch records.
  try {
    const exercises = await listExercises(routineId);
    if (exercises.length <= 0) {
      return res.status(404).send('no exercises found');
    }
    return res.send(exercises);
  } catch (e) {
    console.error(e);
    return res.status(500).send('failed to fetch exercises');
  }
});

exerciseRouter.post('/get', isLoggedIn, async (req, res) => {
  // Validate.
  const { id } = req.body;
  if (!id) {
    return res.status(400).send('id is required');
  }
  // Fetch record.
  try {
    const ex = await getExercise(id);
    if (!ex) {
      return res.status(404).send('exercise not found');
    }
    return res.send(ex);
  } catch (e) {
    console.error(e);
    return res.status(500).send('failed to fetch exercise');
  }
});

// Update exercise by its id.
exerciseRouter.post('/update', isLoggedIn, async (req, res) => {
  // Validate.
  const { id, name, amount, unit, order } = req.body;
  if (!id) {
    return res.status(400).send('id is required');
  }
  if (!name && !amount && !unit && !order) {
    return res
      .status(400)
      .send(
        'require at least one of name, amount, unit or order to be specified',
      );
  }
  // Update record.
  try {
    const ex = await updateExercise(id, { name, amount, unit, order });
    return res.send(ex);
  } catch (e) {
    console.error(e);
    return res.status(500).send('failed to update exercise');
  }
});

// Batch update all exercises provided.
exerciseRouter.post('/batch-update', isLoggedIn, async (req, res) => {
  // Validate.
  const { exercises } = req.body;
  if (exercises.length < 1) {
    return res.status(400).send('no exercises submitted');
  }

  const updatedExercises = [];
  // TODO: Make single call instead of for await loop
  for await (const exercise of exercises) {
    const { id, name, amount, unit, order } = exercise;
    try {
      // Validate.
      if (!id) {
        return res.status(400).send(`id is required for ${name}`);
      }
      if (!name && !amount && !unit && !order) {
        return res
          .status(400)
          .send(
            'require at least one of name, amount, unit or order to be specified',
          );
      }
      // Update record.
      const ex = await updateExercise(id, { name, amount, unit, order });
      updatedExercises.push(ex);
    } catch (e) {
      console.error(e);
      return res.status(500).send(`failed to update exercise ${name}`);
    }
  }

  return res.send(updatedExercises);
});

exerciseRouter.post('/delete', isLoggedIn, async (req, res) => {
  // Validate.
  const { id } = req.body;
  if (!id) {
    return res.status(400).send('id is required');
  }
  // Delete record.
  try {
    const rowCount = await deleteExercise(id);
    if (rowCount === 0) {
      return res.status(400).send('exercise not found');
    }
    return res.status(200).end();
  } catch (e) {
    console.error(e);
    return res.status(500).send('failed to delete exercise');
  }
});

module.exports = exerciseRouter;

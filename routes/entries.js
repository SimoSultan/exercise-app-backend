import express from 'express';

import {
  createEntry,
  deleteEntry,
  listEntries,
  listEntriesPerExerciseOnDate,
  updateEntry,
} from '../database/queries/entries.js';
import { isLoggedIn } from '../middleware/isLoggedIn.js';
import {
  getAESTISOString,
  getEndOfDayFromDate,
  getStartOfDayFromDate,
} from '../utils/utils.js';

const entryRouter = express.Router();

// Create a new entry.
entryRouter.post('/create', isLoggedIn, async (req, res) => {
  // Validate.
  let { exerciseId, amount } = req.body;
  if (!exerciseId) {
    return res.status(400).send('exerciseId is required');
  }
  if (!amount) {
    return res.status(400).send('amount is required');
  }

  const day = new Date();

  // Create record.
  try {
    const entry = await createEntry(exerciseId, amount, day, day);
    return res.send(entry);
  } catch (e) {
    console.error(e);
    return res.status(500).send('failed to create entry');
  }
});

// List exercises by their routine.
entryRouter.post('/list', isLoggedIn, async (req, res) => {
  // Validate.
  const { exerciseId } = req.body;
  if (!exerciseId) {
    return res.status(400).send('exerciseId is required');
  }
  // Fetch records.
  try {
    const entries = await listEntries(exerciseId);
    if (entries.length <= 0) {
      return res.status(404).send('no entries found');
    }
    return res.send(entries);
  } catch (e) {
    console.error(e);
    return res.status(500).send('failed to fetch entries');
  }
});

// Batch get all entries for all exercises for current date.
entryRouter.post('/list-batch-daily', isLoggedIn, async (req, res) => {
  // Validate.
  let { exerciseIds, day } = req.body;

  if (exerciseIds.length < 1) {
    return res.status(400).send('no exercise IDs submitted');
  }
  if (!day) {
    return res.status(400).send('day is required');
  }

  day = getAESTISOString(day);

  // Get the start and end of the day, and pass those in as the time range.
  const start = getStartOfDayFromDate(day);
  const end = getEndOfDayFromDate(day);

  let allEntries = {};
  // TODO: Make single call instead of for await loop
  for await (const id of exerciseIds) {
    // Validate.
    try {
      if (!id) {
        return res.status(400).send('id is required');
      }
      // Update record.
      const entries = await listEntriesPerExerciseOnDate(id, start, end);
      allEntries = {
        ...allEntries,
        [id]: entries,
      };
    } catch (e) {
      console.error(e);
      return res.status(500).send('failed to fetch entries');
    }
  }

  return res.send(allEntries);
});

// Batch get all entries for all exercises for current date.
// entryRouter.post('/list-batch-daily', isLoggedIn, async (req, res) => {
//   // Validate.
//   let { exerciseIds, day } = req.body
//   console.log('exerciseIds', exerciseIds);
// h
//   if (exerciseIds.length < 1) {
//     return res.status(400).send('no exercise IDs submitted')
//   }

//   const stringOfExerciseIds = exerciseIds.join()

//   if (!day) {
//     return res.status(400).send('day is required')
//   }

//   day = getAESTISOString(day)

//   // Get the start and end of the day, and pass those in as the time range.
//   const start = getStartOfDayFromDate(day)
//   const end = getEndOfDayFromDate(day)

//   try {
//     // Update record.
//     const entries = await listEntriesAllExercisesOnDate(stringOfExerciseIds, start, end)
//     console.log('entries', entries);
//     if (entries.length <= 0) {
//       return res.status(404).send('no entries found')
//     }
//     return res.send(entries)
//   } catch (e) {
//     console.error(e)
//     return res.status(500).send('failed to fetch entries')
//   }
// })

entryRouter.post('/update', isLoggedIn, async (req, res) => {
  // Validate.
  const { id, amount } = req.body;
  if (!id) {
    return res.status(400).send('id is required');
  }
  if (!amount) {
    return res.status(400).send('amount is required');
  }
  // Update record.
  try {
    const entry = await updateEntry(id, amount);
    return res.send(entry);
  } catch (e) {
    console.error(e);
    return res.status(500).send('failed to update entry');
  }
});

entryRouter.post('/delete', isLoggedIn, async (req, res) => {
  // Validate.
  const { id } = req.body;
  if (!id) {
    return res.status(400).send('id is required');
  }
  // Delete record.
  try {
    const rowCount = await deleteEntry(id);
    if (rowCount === 0) {
      return res.status(400).send('entry not found');
    }
    return res.status(200).end();
  } catch (e) {
    console.error(e);
    return res.status(500).send('failed to delete entry');
  }
});

export default entryRouter;

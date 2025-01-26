const UTC_TO_AEST_TIME_DIFFERENCE = 10 * 60 * 60 * 1000;

// https://stackoverflow.com/a/1353711
export const isValidDate = (d) => {
  return d instanceof Date && !isNaN(d);
};

export const getAESTISOString = (d) => {
  return new Date(
    new Date(d).getTime() + UTC_TO_AEST_TIME_DIFFERENCE,
  ).toISOString();
};

export const getStartOfDayFromDate = (d) => {
  return d.split('T')[0] + 'T00:00:00.000Z';
};

export const getEndOfDayFromDate = (d) => {
  return d.split('T')[0] + 'T23:59:59.000Z';
};

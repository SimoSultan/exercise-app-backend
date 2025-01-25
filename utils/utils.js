const UTC_TO_AEST_TIME_DIFFERENCE = 10 * 60 * 60 * 1000;

// https://stackoverflow.com/a/1353711
function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function getAESTISOString(d) {
  return new Date(
    new Date(d).getTime() + UTC_TO_AEST_TIME_DIFFERENCE,
  ).toISOString();
}

// function getUTCFromAEST(d) {
//   return new Date(new Date(d).getTime() - UTC_TO_AEST_TIME_DIFFERENCE).toISOString()
// }

function getStartOfDayFromDate(d) {
  return d.split('T')[0] + 'T00:00:00.000Z';
}

function getEndOfDayFromDate(d) {
  return d.split('T')[0] + 'T23:59:59.000Z';
}

module.exports = {
  isValidDate,
  getAESTISOString,
  getStartOfDayFromDate,
  getEndOfDayFromDate,
};

const _ = require('lodash/fp');

const STATUSES = {OK: 0, WARNING: 1, CRITICAL: 2, UNKNOWN: 3};
module.exports = {
  STATUSES,
  ALL_STATUSES: _.values(STATUSES)
};

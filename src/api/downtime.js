const _ = require('lodash/fp');

module.exports = {
  create: {
    comment: 'schedule a new downtime',
    method: 'POST',
    path: '/downtime',
    params: [
      {
        name: 'scope',
        description: 'string scope that the downtime should apply to (e.g. "env:staging")'
      },
      {
        name: 'properties',
        description: 'optional, an object containing any of the following',
        properties: {
          start: 'POSIX timestamp for when the downtime should start',
          end: 'POSIX timestamp for when the downtime should end',
          message: 'a string message to accompany the downtime'
        }
      }
    ],
    toParams(scope, properties) {
      const params = {scope};
      if (_.isObject(properties)) {
        if (properties.start) params.start = parseInt(properties.start);
        if (properties.end) params.end = parseInt(properties.end);
        if (properties.message) params.message = properties.message;
      }
    }
  },
  update: {
    comment: 'schedule a new downtime',
    method: 'PUT',
    path: '/downtime/*',
    params: [
      {
        name: 'downtimeId',
        description: 'id for the downtime',
        type: 'id'
      },
      {
        name: 'properties',
        description: 'optional, an object containing any of the following',
        properties: {
          start: 'POSIX timestamp for when the downtime should start',
          end: 'POSIX timestamp for when the downtime should end',
          message: 'a string message to accompany the downtime',
          scope: 'string scope that the downtime should apply to (e.g. "env:staging")'
        }
      }
    ],
    toParams(properties) {
      const params = {};
      if (_.isObject(properties)) {
        if (properties.scope) params.start = properties.scope;
        if (properties.start) params.start = parseInt(properties.start);
        if (properties.end) params.end = parseInt(properties.end);
        if (properties.message) params.message = properties.message;
      }
    }
  },
  remove: {
    comment: 'delete a scheduled downtime',
    method: 'DELETE',
    path: '/commands/*',
    params: [{name: 'downtimeId', description: 'the id of the downtime', type: 'id'}]
  },
  get: {
    comment: 'get a scheduled downtimes details',
    method: 'GET',
    path: '/downtime/*',
    params: [
      {
        name: 'downtimeId',
        description: 'id of the downtime',
        type: 'id'
      }
    ]
  },
  getAll: {
    comment: 'get all downtimes details',
    method: 'GET',
    path: '/downtime'
    // TODO: support pagination
  }
};

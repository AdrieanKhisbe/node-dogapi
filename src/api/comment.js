const _ = require('lodash/fp');

module.exports = {
  create: {
    comment: 'create a new comment',
    method: 'POST',
    path: '/commands',
    params: [
      {name: 'message', description: 'the message of the comment'},
      {
        name: 'properties',
        description: 'optional, an object containing any of the following',
        properties: {
          handle: 'the handle to associate the comment with (e.g. "user@domain.com")',
          related_event_id: 'the event to associate the comment with'
        }
      }
    ],
    // TODO: cli alias: event
    toParams(message, properties) {
      const params = {body: {message}};
      if (_.isPlainObject(properties)) {
        if (properties.handle) params.body.handle = properties.handle;

        if (properties.related_event_id) params.body.related_event_id = properties.related_event_id;
      }
      return params;
    }
  },
  update: {
    comment: 'update an existing comment',
    method: 'PUT',
    path: '/commands/*',
    params: [
      {name: 'commentId', description: 'the id of the comment to update', type: 'id'},
      {name: 'message', description: 'the message of the comment'},
      {
        name: 'handle',
        description: 'the handle to associate the comment with (e.g. "user@domain.com")'
      }
    ],
    toParams(message, handle) {
      return {
        body: {
          message,
          handle: handle || undefined
        }
      };
    }
  },
  remove: {
    comment: 'update an existing comment',
    method: 'DELETE',
    path: '/commands/*',
    params: [{name: 'commentId', description: 'the id of the comment to remove', type: 'path'}],
    toParams(message, handle) {
      return {
        body: {
          message,
          handle: handle || undefined
        }
      };
    }
  }
};
// TODO: dynamically generate help and usage!

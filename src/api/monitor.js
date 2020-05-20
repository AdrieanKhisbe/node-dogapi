const _ = require('lodash/fp');

module.exports = function(client) {
  /* section: monitor
   *comment: create a new monitor
   *params:
   *  type: one of "metric alert" or "service check"
   *  query: the monitor query to use, you probably want to read datadog's [monitor create](http://docs.datadoghq.com/api/#monitor-create) docs
   *  properties: |
   *    optional, an object containing any of the following
   *    * name: the name of the monitor
   *    * message: the message for the monitor
   *    * tags: a list of strings as tags to associate with the monitor
   *    * options: an object, to see available options please see the [monitor create](http://docs.datadoghq.com/api/#monitor-create) docs
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  const metricType = "metric alert";
   *  const query = "avg(last_1h):sum:system.net.bytes_rcvd{host:host0} > 100";
   *  dogapi.monitor.create(metricType, query, function(err, res){
   *    console.dir(res);
   *  });
   *  ```
   */
  function create(type, query, properties, callback) {
    if (!callback && _.isFunction(properties)) {
      callback = properties;
      properties = {};
    }

    const params = {body: {type, query}};

    if (_.isObject(properties)) {
      if (properties.name) params.body.name = properties.name;

      if (properties.message) params.body.message = properties.message;

      if (properties.tags) params.body.tags = properties.tags;

      if (_.isObject(properties.options)) params.body.options = properties.options;
    }
    return client.request('POST', '/monitor', params, callback);
  }

  /* section: monitor
   *comment: get an existing monitor's details
   *params:
   *  monitorId: the id of the monitor
   *  groupStates: an array containing any of the following "all", "alert", "warn", or "no data"
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  dogapi.monitor.get(1234, function(err, res){
   *    console.dir(res);
   *  });
   *  ```
   */
  function get(monitorId, groupStates, callback) {
    if (!callback && _.isFunction(groupStates)) {
      callback = groupStates;
      groupStates = undefined;
    }

    const params = {
      query: groupStates ? {group_states: groupStates.join(',')} : undefined
    };

    return client.request('GET', `/monitor/${monitorId}`, params, callback);
  }

  /* section: monitor
   *comment: get all monitors
   *params:
   *  options: |
   *    optional, an object containing any of the following
   *    * group_states: an array containing any of the following "all", "alert", "warn", or "no data"
   *    * tags: an array of "tag:value"'s to filter on
   *    * monitor_tags: a comma separated list indicating what service and/or custom tags
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  dogapi.monitor.getAll(function(err, res){
   *    console.dir(res);
   *  });
   *  ```
   */
  function getAll(options, callback) {
    if (!callback && _.isFunction(options)) {
      callback = options;
      options = {};
    }
    const params = {};
    if (_.isObject(options)) {
      params.query = {
        group_states: options.group_states ? options.group_states.join(',') : undefined,
        tags: options.tags ? options.tags.join(',') : undefined,
        monitor_tags: options.monitor_tags ? options.monitor_tags.join(',') : undefined
      };
    }
    return client.request('GET', '/monitor', params, callback);
  }

  /* section: monitor
   *comment: update a monitor's details
   *params:
   *  monitorId: the id of the monitor to edit
   *  query: the query that the monitor should have, see the [monitor create](http://docs.datadoghq.com/api/#monitor-create) docs for more info
   *  properties: |
   *    optional, an object containing any of the following
   *    * name: the name of the monitor
   *    * message: the message for the monitor
   *    * tags: a list of strings as tags to associate with the monitor
   *    * options: an object, to see available options please see the [monitor create](http://docs.datadoghq.com/api/#monitor-create) docs
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  const query = "avg(last_1h):sum:system.net.bytes_rcvd{host:host0} > 100";
   *  dogapi.monitor.update(1234, query, function(err, res){
   *    console.dir(res);
   *  });
   *  ```
   */
  function update(monitorId, query, properties, callback) {
    if (!callback && _.isFunction(properties)) {
      callback = properties;
      properties = {};
    }

    const params = {body: {query}};

    if (_.isObject(properties)) {
      if (properties.name) params.body.name = properties.name;

      if (properties.message) params.body.message = properties.message;

      if (properties.tags) params.body.tags = properties.tags;

      if (_.isObject(properties.options)) params.body.options = properties.options;
    }
    return client.request('PUT', `/monitor/${monitorId}`, params, callback);
  }

  /* section: monitor
   *comment: delete an existing monitor
   *params:
   *  monitorId: the id of the monitor to remove
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  dogapi.monitor.remove(1234, function(err, res){
   *    console.dir(res);
   *  });
   *  ```
   */
  function remove(monitorId, callback) {
    return client.request('DELETE', `/monitor/${monitorId}`, callback);
  }

  /* section: monitor
   *comment: mute an existing monitor
   *params:
   *  monitorId: the id of the monitor to mute
   *  options: |
   *    optional, an object containing any of the following
   *    * scope: the scope to mute (e.g. "role:db")
   *    * end: POSIX timestamp indicating when the mute should end
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  dogapi.monitor.mute(1234, function(err, res){
   *    console.dir(res);
   *  });
   *  ```
   */
  function mute(monitorId, options, callback) {
    if (!callback && _.isFunction(options)) {
      callback = options;
      options = {};
    }
    const params = {};
    if (_.isObject(options)) {
      params.body = {
        scope: options.scope || undefined,
        end: options.end ? parseInt(options.end) : undefined
      };
    } else {
      params.body = ''; // create empty body
    }
    return client.request('POST', `/monitor/${monitorId}/mute`, params, callback);
  }

  /* section: monitor
   *comment: mute all monitors
   *params:
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  dogapi.monitor.muteAll(function(err, res){
   *    console.dir(res);
   *  });
   *  ```
   */
  function muteAll(callback) {
    return client.request('POST', '/monitor/mute_all', callback);
  }

  /* section: monitor
   *comment: unmute an existing monitor
   *params:
   *  monitorId: the id of the monitor to unmute
   *  scope: optional, a scope to apply the unmute to (e.g. "role:db")
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  dogapi.monitor.unmute(1234, function(err, res){
   *    console.dir(res);
   *  });
   *  ```
   */
  function unmute(monitorId, scope, callback) {
    if (!callback && _.isFunction(scope)) {
      callback = scope;
      scope = undefined;
    }
    const params = {body: scope ? {scope} : ''};
    return client.request('POST', `/monitor/${monitorId}/unmute`, params, callback);
  }

  /* section: monitor
   *comment: unmute all monitors
   *params:
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  dogapi.monitor.unmuteAll(function(err, res){
   *    console.dir(res);
   *  });
   *  ```
   */
  function unmuteAll(callback) {
    return client.request('POST', '/monitor/unmute_all', callback);
  }

  return {
    create,
    get,
    update,
    remove,
    getAll,
    mute,
    muteAll,
    unmute,
    unmuteAll,
    getUsage() {
      return [
        '  dogapi monitor create <type> <query> [--name <name>] [--message <message>]',
        '  dogapi monitor get <monitor-id> [--states <states>]',
        '  dogapi monitor getall [--states <states>] [--tags <tags>]',
        '  dogapi monitor mute <monitor-id> [--scope <scope>] [--end <end>]',
        '  dogapi monitor muteall',
        '  dogapi monitor remove <monitor-id>',
        '  dogapi monitor unmute <monitor-id> [--scope <scope>]',
        '  dogapi monitor unmuteall',
        '  dogapi monitor update <monitor-id> <query> [--name <name>] [--message <message>]'
      ];
    },
    getHelp() {
      return [
        'Monitor:',
        '  Subcommands:',
        '    create <type> <query>          create a new monitor',
        '    get <monitor-id>               get a monitors details',
        '    getall                         get a list of all monitors',
        '    mute <monitor-id>              mute the monitor with the id <monitor-id>',
        '    muteall                        mute all monitors',
        '    remove <monitor-id>            delete the monitor with the id <monitor-id>',
        '    unmute <monitor-id>            unmute the monitor with the id <monitor-id>',
        '    unmuteall                      unmute all monitors',
        '    update <monitor-id> <query>    update an existing monitor',
        '',
        '  Options:',
        '    --states <states>              a comma separated list containing any of "all", "alert", "warn", or "no data"',
        '    --tags <tags>                  a comma separated list of "tag:value"\'s',
        '    --scope <scope>                the scope of the monitor to mute (e.g. "role:db")',
        '    --end <end>                    POSIX timestamp for when the mute should end',
        '    --name <name>                  the name for the monitor',
        '    --message <message>            the message for the monitor'
      ];
    },
    handleCli(subcommand, args, callback) {
      const states = args.states ? args.states.split(',') : [];
      const tags = args.tags ? args.tags.split(',') : [];

      const name = args.name;
      const message = args.message;

      if (subcommand === 'get') {
        const monitorId = args._[4];
        get(monitorId, states, callback);
      } else if (subcommand === 'getall') {
        const options = {
          group_states: states.length > 0 ? states : undefined,
          tags: tags.length > 0 ? tags : undefined
        };
        getAll(options, callback);
      } else if (subcommand === 'mute') {
        const monitorId = args._[4];
        const options = {
          scope: args.scope || undefined,
          end: args.end || undefined
        };
        mute(monitorId, options, callback);
      } else if (subcommand === 'unmute') {
        const monitorId = args._[4];
        const scope = args.scope;
        unmute(monitorId, scope, callback);
      } else if (subcommand === 'unmuteall') {
        unmuteAll(callback);
      } else if (subcommand === 'muteall') {
        muteAll(callback);
      } else if (subcommand === 'remove') {
        const monitorId = args._[4];
        remove(monitorId, callback);
      } else if (subcommand === 'create' && args._.length > 5) {
        const type = args._[4];
        const query = args._[5];
        const properties = {
          name: name || undefined,
          message: message || undefined
        };
        create(type, query, properties, callback);
      } else if (subcommand === 'update' && args._.length > 5) {
        const monitorId = args._[4];
        const query = args._[5];
        const properties = {
          name: name || undefined,
          message: message || undefined
        };
        update(monitorId, query, properties, callback);
      } else {
        return callback(
          'unknown subcommand or arguments try `dogapi monitor --help` for help',
          false
        );
      }
    }
  };
};

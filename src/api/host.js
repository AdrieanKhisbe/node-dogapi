const _ = require('lodash/fp');

module.exports = function(client) {
  /* section: host
   *comment: mute the given host, if it is not already muted
   *params:
   *  hostname: the hostname of the host to mute
   *  options: |
   *    optional, an object containing any of the following
   *    * end: POSIX timestamp for when the mute should end
   *    * override: whether or not to override the end for an existing mute
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  dogapi.host.mute("my.host.name", function(err, res){
   *    console.dir(res);
   *  });
   *  ```
   */
  function mute(hostname, options, callback) {
    if (!callback && _.isFunction(options)) {
      callback = options;
      options = {};
    }
    const params = {};
    if (_.isObject(options)) {
      // create body property
      params.body = {
        end: options.end ? parseInt(options.end) : undefined,
        override: options.override || undefined
      };
    } else {
      params.body = ''; // create empty body
    }
    return client.request('POST', `/host/${hostname}/mute`, params, callback);
  }

  /* section: host
   *comment: unmute the given host, if it is not already unmuted
   *params:
   *  hostname: the hostname of the host to unmute
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  dogapi.host.unmute("my.host.name", function(err, res){
   *    console.dir(res);
   *  });
   *  ```
   */
  function unmute(hostname, callback) {
    const params = {body: ''}; // create empty body
    return client.request('POST', `/host/${hostname}/unmute`, params, callback);
  }

  return {
    mute,
    unmute,
    getUsage() {
      return [
        '  dogapi host mute <host> [--end <end>] [--override]',
        '  dogapi host unmute <host>'
      ];
    },
    getHelp() {
      return [
        'Host:',
        '  Subcommands:',
        '    mute <host>      mute the host with the provided hostname',
        '    unmute <host>    unmute the host with the provided hostname',
        '',
        '  Options:',
        '    --end <end>      POSIX timestamp for when the mute should end',
        '    --override       override an existing "end" for a mute on a host'
      ];
    },
    handleCli(subcommand, args, callback) {
      if (subcommand === 'mute') {
        const hostname = args._[4];
        const options = {
          end: options.end ? parseInt(args.end) : undefined,
          override: args.override || undefined
        };
        mute(hostname, options, callback);
      } else if (subcommand === 'unmute') {
        const hostname = args._[4];
        unmute(hostname, callback);
      } else {
        return callback('unknown subcommand or arguments try `dogapi host --help` for help', false);
      }
    }
  };
};

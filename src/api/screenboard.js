const _ = require('lodash/fp');
const json = require('json-bigint');

module.exports = function(client) {
  /* section: screenboard
   *comment: create a new screenboard
   *params:
   *  boardTitle: the name of the screenboard
   *  widgets: an array of widgets, see http://docs.datadoghq.com/api/screenboards/ for more info
   *  options: |
   *    optional, a object which can contain any of the following keys
   *    * description: description of the screenboard
   *    * templateVariables: |
   *      an array of objects with the following keys
   *      * name: the name of the variable
   *      * prefix: optional, the tag prefix for this variable
   *      * default: optional, the default value for this tag
   *    * width: the width of the screenboard in pixels
   *    * height: the height of the screenboard in pixels
   *    * readOnly: the read-only status of the screenboard
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  const boardTitle = "my screenboard";
   *  const widgets = [
   *    {
   *      type: "image",
   *      height: 20,
   *      width: 32,
   *      y: 7,
   *      x: 32,
   *      url: "https://path/to/image.jpg"
   *    }
   *  ];
   *  const options = {
   *    templateVariables: [
   *      {
   *        name: "host1",
   *        prefix: "host",
   *        "default": "host:my-host"
   *      }
   *    ],
   *    description: "it is super awesome"
   *  };
   *  dogapi.screenboard.create(
   *    boardTitle, widgets, options,
   *    function(err, res){
   *      console.dir(res);
   *    }
   *  );
   *  ```
   */
  function create(boardTitle, widgets, options, callback) {
    if (!callback && _.isFunction(options)) {
      callback = options;
      options = {};
    }
    if (!_.isObject(options)) {
      options = {};
    }

    const params = {
      body: {
        board_title: boardTitle,
        widgets,
        description: options.description || undefined,
        template_variables: options.templateVariables || undefined,
        width: options.width || undefined,
        height: options.height || undefined,
        read_only: options.readOnly || undefined
      }
    };

    return client.request('POST', '/screen', params, callback);
  }

  /* section: screenboard
   *comment: update an existing screenboard
   *params:
   *  boardId: the id of the screenboard to update
   *  boardTitle: the name of the screenboard
   *  widgets: an array of widgets, see http://docs.datadoghq.com/api/screenboards/ for more info
   *  options: |
   *    optional, a object which can contain any of the following keys
   *    * description: description of the screenboard
   *    * templateVariables: |
   *      an array of objects with the following keys
   *      * name: the name of the variable
   *      * prefix: optional, the tag prefix for this variable
   *      * default: optional, the default value for this tag
   *    * width: the width of the screenboard in pixels
   *    * height: the height of the screenboard in pixels
   *    * readOnly: the read-only status of the screenboard
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  const boardTitle = "my screenboard";
   *  const widgets = [
   *    {
   *      type: "image",
   *      height: 20,
   *      width: 32,
   *      y: 7,
   *      x: 32,
   *      url: "https://path/to/image.jpg"
   *    }
   *  ];
   *  const options = {
   *    description: "it is super awesome"
   *  };
   *  dogapi.screenboard.update(
   *    1234, boardTitle, widgets, options,
   *    function(err, res){
   *      console.dir(res);
   *    }
   *  );
   *  ```
   */
  function update(boardId, boardTitle, widgets, options, callback) {
    if (!callback && _.isFunction(options)) {
      callback = options;
      options = {};
    }
    if (!_.isFunction(options)) {
      options = {};
    }

    const params = {
      body: {
        board_title: boardTitle,
        widgets,
        description: options.description || undefined,
        template_variables: options.templateVariables || undefined,
        width: options.width || undefined,
        height: options.height || undefined,
        read_only: options.readOnly || undefined
      }
    };

    return client.request('PUT', `/screen/${boardId}`, params, callback);
  }

  /* section: screenboard
   *comment: delete an existing screenboard
   *params:
   *  boardId: the id of the screenboard to delete
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  dogapi.screenboard.remove(1234, function(err, res){
   *    console.dir(res);
   *  });
   *  ```
   */
  function remove(boardId, callback) {
    return client.request('DELETE', `/screen/${boardId}`, callback);
  }

  /* section: screenboard
   *comment: get the info of a single existing screenboard
   *params:
   *  boardId: the id of the screenboard to fetch
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  dogapi.screenboard.get(1234, function(err, res){
   *    console.dir(res);
   *  });
   *  ```
   */
  function get(boardId, callback) {
    return client.request('GET', `/screen/${boardId}`, callback);
  }

  /* section: screenboard
   *comment: get all existing screenboards
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
   *  dogapi.screenboard.getAll(function(err, res){
   *    console.dir(res);
   *  });
   *  ```
   */
  function getAll(callback) {
    return client.request('GET', '/screen', callback);
  }

  /* section: screenboard
   *comment: share an existing screenboard
   *params:
   *  boardId: the id of the screenboard to share
   *  callback: function(err, res)
   *example: |
   *  ```javascript
   *  const dogapi = require("dogapi");
   *  const options = {
   *    api_key: "api_key",
   *    app_key: "app_key"
   *  };
   *  dogapi.initialize(options);
   *  dogapi.screenboard.share(1234, function(err, res){
   *    console.dir(res);
   *  });
   *  ```
   */
  function share(boardId, callback) {
    return client.request('POST', `/screen/share/${boardId}`, callback);
  }

  return {
    create,
    remove,
    update,
    get,
    getAll,
    share,
    getUsage() {
      return [
        '  dogapi screenboard create <boardTitle> <widgets> [--description <description>] [--tmpvars <templateVariables>] [--width <width>] [--height <height>]',
        '  dogapi screenboard remove <boardId>',
        '  dogapi screenboard get <boardId>',
        '  dogapi screenboard getall',
        '  dogapi screenboard share <boardId>'
      ];
    },
    getHelp() {
      return [
        'Screenboard:',
        '  Subcommands:',
        '    create <boardTitle> <widgets>           create a new screenboard, <widgets> is a json of the graph definition',
        '    update <boardId> <boardTitle> <widgets> update a screenboard',
        '    remove <boardId>                        remove an existing screenboard',
        '    get <boardId>                           get an existing screenboard',
        '    getall                                  get all screenboards',
        '    share <boardId>                         get share info for an existing screenboard',
        '  Options:',
        "    --description <description>             a description of the screenboard's content",
        '    --tmpvars <templateVariables>           json representation of the template variable definition',
        '    --width <width>                         width of the screenboard in pixels',
        '    --height <height>                       height of the screenboard in pixels'
      ];
    },
    handleCli(subcommand, args, callback) {
      if (subcommand === 'get') {
        get(args._[4], callback);
      } else if (subcommand === 'getall') {
        getAll(callback);
      } else if (subcommand === 'remove') {
        remove(args._[4], callback);
      } else if (subcommand === 'share') {
        share(args._[4], callback);
      } else if (subcommand === 'update') {
        const boardId = args._[4];
        const boardTitle = args._[5];
        const widgets = json.parse(args._[6]);

        const options = {
          description: args.description,
          templateVariables: args.tmpvars ? json.parse(args.tmpvars) : undefined,
          width: args.width ? parseInt(args.width) : undefined,
          height: args.height ? parseInt(args.height) : undefined
        };

        update(boardId, boardTitle, widgets, options, callback);
      } else if (subcommand === 'create') {
        const boardTitle = args._[4];
        const widgets = json.parse(args._[5]);

        const options = {
          description: args.description,
          templateVariables: args.tmpvars ? json.parse(args.tmpvars) : undefined,
          width: args.width ? parseInt(args.width) : undefined,
          height: args.height ? parseInt(args.height) : undefined
        };

        create(boardTitle, widgets, options, callback);
      } else {
        return callback(
          'unknown subcommand or arguments try `dogapi screenboard --help` for help',
          false
        );
      }
    }
  };
};

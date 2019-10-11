const request = require('request-promise');
const _ = require('lodash/fp');
const json = require('json-bigint');

const CLIENT_DEFAULTS = {
  api_key: null,
  app_key: null,
  proxy_agent: null,
  api_version: 'v1',
  api_host: 'app.datadoghq.com'
};
/* section: client
 *comment: |
 *  the constructor for _client_ object
 *params:
 *example: |
 *  See [client.request](#client-request)
 */
const DatadogMetricClient = function(options) {
  this.options = _.defaults(CLIENT_DEFAULTS, options);
};

/* section: client
 *comment: |
 *  used to make a raw request to the datadog api
 *params:
 *  method: |
 *    http method GET, POST, PUT, DELETE
 *  path: |
 *    the api url path e.g. /tags/hosts
 *  params: |
 *    an object which allows the keys `query` or `body`
 *  callback: |
 *    function to call on success/failure callback(err, result)
 *example: |
 *   ```javascript
 *   var dogapi = require("dogapi");
 *   var options = {
 *     api_key: "api_key",
 *     app_key: "app_key"
 *   };
 *   dogapi.initialize(options);
 *   dogapi.client.request("GET", "/url/path", {}, function(err, results){
 *     console.dir(results);
 *   });
 *   ```
 */
DatadogMetricClient.prototype.request = function(method, path, params, callback) {
  const {api_key, app_key, agent, api_host, api_version} = this.options;
  if (_.isUndefined(callback) && _.isFunction(params)) {
    callback = params;
    params = {body: ''}; // create params with empty body property
  }

  const body = _.isPlainObject(params.body) ? json.stringify(params.body) : params.body;
  const query = _.extend({api_key, application_key: app_key}, params.query);

  const headers = {};
  if (['POST', 'PUT'].includes(method)) {
    headers['Content-Type'] = params.contentType || 'application/json';
    //  'Content-Length': Buffer.byteLength(body) -> lib should take care of it
  }
  const reqPromise = request({
    uri: `https://${api_host}/api/${api_version}${path}`,
    method,
    qs: query,
    headers,
    json: true,
    body,
    agent,
    timeout: 30000 // TODO: make it configurable
  });

  return _.isFunction(callback === 'function')
    ? reqPromise.then(res => callback(null, res)).catch(callback)
    : reqPromise;
};

module.exports = DatadogMetricClient;

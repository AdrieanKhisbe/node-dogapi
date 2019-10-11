const request = require('request-promise');
const _ = require('lodash/fp');
const json = require('json-bigint');

/* section: client
 *comment: |
 *  the constructor for _client_ object
 *params:
 *example: |
 *  See [client.request](#client-request)
 */
const DatadogMetricClient = function(options) {
  this.api_key = options.api_key || null;
  this.app_key = options.app_key || null;
  this.proxy_agent = options.proxy_agent || null;
  this.api_version = options.api_version || 'v1';
  this.api_host = options.api_host || 'app.datadoghq.com';
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
  if (_.isUndefined(callback) && _.isFunction(params)) {
    callback = params;
    params = {body: ''}; // create params with empty body property
  }

  const body = _.isPlainObject(params.body) ? json.stringify(params.body) : params.body;
  const query = _.extend({api_key: this.api_key, application_key: this.app_key}, params.query);

  const headers = {};
  if (['POST', 'PUT'].includes(method)) {
    headers['Content-Type'] = params.contentType || 'application/json';
    //  'Content-Length': Buffer.byteLength(body) -> lib should take care of it
  }
  const reqPromise = request({
    uri: `https://${this.api_host}/api/${this.api_version}${path}`,
    method,
    qs: query,
    headers,
    json: true,
    body,
    agent: this.agent,
    timeout: 30000 // TODO: make it configurable
  });

  return _.isFunction(callback === 'function')
    ? reqPromise.then(res => callback(null, res)).catch(callback)
    : reqPromise;
};

module.exports = DatadogMetricClient;

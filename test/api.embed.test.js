const querystring = require('querystring');
const test = require('ava');
const sinon = require('sinon');
const Client = require('../src/client');
const Embed = require('../src/api/embed');

test.beforeEach(t => {
  const client = new Client({});
  const spy = sinon.spy(client, 'request');
  const embed = Embed(client); //
  t.context.embed = embed;
  t.context.spy = spy;
});

test('should make a valid api call', t => {
  const {spy, embed} = t.context;
  const graphJSON = {viz: 'timeseries', requests: [{q: 'system.cpu.idle{*}'}]};
  const options = {
    timeframe: '1_hour',
    size: 'large',
    legend: 'yes',
    title: 'test graph embed'
  };

  // Make our api call
  embed.create(graphJSON, options);

  // Assert we properly called `client.request`
  t.true(spy.calledOnce);
  const call_args = spy.getCall(0).args;
  // Method and endpoint are correct
  t.is(call_args[0], 'POST');
  t.is(call_args[1], '/graph/embed');

  // Properly formatted body and content-type
  const params = call_args[2];
  const expectedBody = {
    graph_json: JSON.stringify(graphJSON),
    timeframe: '1_hour',
    size: 'large',
    legend: 'yes',
    title: 'test graph embed'
  };
  t.deepEqual(querystring.parse(params.body), expectedBody);
  t.is(params.contentType, 'application/x-www-form-urlencoded');
});

test('should only require graph_json', t => {
  const {spy, embed} = t.context;
  const graphJSON = {viz: 'timeseries', requests: [{q: 'system.cpu.idle{*}'}]};

  // Make our api call
  embed.create(graphJSON);

  // Assert we properly called `client.request`
  t.true(spy.calledOnce);
  const call_args = spy.getCall(0).args;

  // Properly formatted body
  const params = call_args[2];
  const expectedBody = {graph_json: JSON.stringify(graphJSON)};
  t.deepEqual(querystring.parse(params.body), expectedBody);
});

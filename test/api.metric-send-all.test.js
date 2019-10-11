const test = require('ava');
const sinon = require('sinon');
const Client = require('../src/client');
const Metric = require('../src/api/metric');

const client = new Client({});
const metric = Metric(client);

let stub_request;
test.beforeEach(() => {
  stub_request = sinon.stub(client, 'request');
});
test.afterEach(() => {
  stub_request.restore();
  stub_request = null;
});

test('should make a valid api call', t => {
  // Make our api call
  const now = parseInt(new Date().getTime() / 1000);
  const metrics = [{metric: 'metric.send_all', points: [[now, 500]]}];
  metric.send_all(metrics);

  // Assert we properly called `client.request`
  t.true(stub_request.calledOnce);
  const call_args = stub_request.getCall(0).args;
  // Method and endpoint are correct
  t.is(call_args[0], 'POST');
  t.is(call_args[1], '/series');

  // Properly formatted body
  // { body: series: [ {metric: "metric.send_all", host: undefined, tags: undefined, type: undefined} ] }
  // DEV: host/tags/type are optional and should be undefined for this case
  const data = call_args[2];
  t.true(data.hasOwnProperty('body'));
  t.true(data.body.hasOwnProperty('series'));

  // Assert we have only 1 series
  // series = [ {metric: "", ...}, ... ]
  const series = data.body.series;
  t.true(Array.isArray(series));
  t.is(series.length, 1);

  // Assert the first series is properly formatted
  // first_series = {metric: "", points: [], ...}
  const first_series = series[0];
  t.is(first_series.metric, 'metric.send_all');
  t.true(Array.isArray(first_series.points));
  t.deepEqual(first_series.points, [[now, 500]]);
});

test('should properly normalize metric points', t => {
  // Make our api call
  const now = parseInt(new Date().getTime() / 1000);
  const metrics = [
    {metric: 'metric.send_all.normalize', points: [[now, 500]]},
    {metric: 'metric.send_all.normalize', points: [500, 1000]},
    {metric: 'metric.send_all.normalize', points: 1000}
  ];
  metric.send_all(metrics);

  // Assert we called `client.request` with the correct `points`
  t.true(stub_request.calledOnce);
  const call_args = stub_request.getCall(0).args;
  // { body: series: [ {points: [], }, ] }
  const body = call_args[2].body;
  t.is(body.series.length, 3);

  // points = [ [<timestamp>, 500] ]
  let points = body.series[0].points;
  t.true(Array.isArray(points));
  t.is(points.length, 1);
  t.is(points[0].length, 2);
  t.is(points[0][1], 500);

  // points = [ [<timestamp>, 500], [<timestamp>, 1000] ]
  points = body.series[1].points;
  t.true(Array.isArray(points));
  t.is(points.length, 2);
  t.is(points[0].length, 2);
  t.is(points[0][1], 500);
  t.is(points[1].length, 2);
  t.is(points[1][1], 1000);

  // points = [ [<timestamp>, 1000] ]
  points = body.series[2].points;
  t.true(Array.isArray(points));
  t.is(points.length, 1);
  t.is(points[0].length, 2);
  t.is(points[0][1], 1000);
});

test('should properly send metric type', t => {
  // Make our api call
  const metrics = [{metric: 'metric.send.counter', points: 5, type: 'count'}];
  metric.send_all(metrics);

  // Assert we properly called `client.request`
  t.true(stub_request.calledOnce);
  const call_args = stub_request.getCall(0).args;
  // Method and endpoint are correct
  t.is(call_args[0], 'POST');
  t.is(call_args[1], '/series');

  // Properly formatted body
  // { body: series: [ {metric: "metric.send.counter", host: undefined, tags: undefined, type: "count"} ] }
  // DEV: host/tags are optional and should be undefined for this case
  const data = call_args[2];
  t.true(data.hasOwnProperty('body'));
  t.true(data.body.hasOwnProperty('series'));

  // Assert we have only 1 series
  // series = [ {metric: "", ...}, ... ]
  const series = data.body.series;
  t.true(Array.isArray(series));
  t.is(series.length, 1);

  // Assert the first series is properly formatted
  // first_series = {metric: "", type: "count", points: [], ...}
  const first_series = series[0];
  t.is(first_series.metric, 'metric.send.counter');
  t.true(Array.isArray(first_series.points));
  t.deepEqual(first_series.type, 'count');
});

test('should properly send metric_type as type', t => {
  // Make our api call
  const metrics = [{metric: 'metric.send.counter', points: 5, metric_type: 'count'}];
  metric.send_all(metrics);

  // Assert we properly called `client.request`
  t.true(stub_request.calledOnce);
  const call_args = stub_request.getCall(0).args;
  // Method and endpoint are correct
  t.is(call_args[0], 'POST');
  t.is(call_args[1], '/series');

  // Properly formatted body
  // { body: series: [ {metric: "metric.send.counter", host: undefined, tags: undefined, type: "count"} ] }
  // DEV: host/tags are optional and should be undefined for this case
  const data = call_args[2];
  t.true(data.hasOwnProperty('body'));
  t.true(data.body.hasOwnProperty('series'));

  // Assert we have only 1 series
  // series = [ {metric: "", ...}, ... ]
  const series = data.body.series;
  t.true(Array.isArray(series));
  t.is(series.length, 1);

  // Assert the first series is properly formatted
  // first_series = {metric: "", type: "count", points: [], ...}
  const first_series = series[0];
  t.is(first_series.metric, 'metric.send.counter');
  t.true(Array.isArray(first_series.points));
  t.deepEqual(first_series.type, 'count');
});

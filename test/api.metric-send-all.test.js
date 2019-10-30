const test = require('ava');
const _ = require('lodash/fp');
const sinon = require('sinon');
const Client = require('../src/api-client');
const Metric = require('../src/api/metric');

test.beforeEach(t => {
  const client = new Client({});
  const spy = sinon.spy(client, 'request');
  const metric = Metric(client); //
  t.context.metric = metric;
  t.context.spy = spy;
});

test('should make a valid api call', t => {
  const {metric, spy} = t.context;
  // Make our api call
  const now = parseInt(new Date().getTime() / 1000);
  const metrics = [{metric: 'metric.send_all', points: [[now, 500]]}];
  metric.send_all(metrics);

  // Assert we properly called `client.request`
  t.assert(spy.calledOnce);
  const call_args = spy.getCall(0).args;
  // Method and endpoint are correct
  t.is(call_args[0], 'POST');
  t.is(call_args[1], '/series');

  // Properly formatted body
  // { body: series: [ {metric: "metric.send_all", host: undefined, tags: undefined, type: undefined} ] }
  // DEV: host/tags/type are optional and should be undefined for this case
  const data = call_args[2];
  t.assert(_.has('body', data));
  t.assert(_.has('series', data.body));

  // Assert we have only 1 series
  // series = [ {metric: "", ...}, ... ]
  const series = data.body.series;
  t.assert(Array.isArray(series));
  t.is(series.length, 1);

  // Assert the first series is properly formatted
  // first_series = {metric: "", points: [], ...}
  const first_series = series[0];
  t.is(first_series.metric, 'metric.send_all');
  t.assert(Array.isArray(first_series.points));
  t.deepEqual(first_series.points, [[now, 500]]);
});

test('should properly normalize metric points', t => {
  const {metric, spy} = t.context;

  // Make our api call
  const now = parseInt(new Date().getTime() / 1000);
  const metrics = [
    {metric: 'metric.send_all.normalize', points: [[now, 500]]},
    {metric: 'metric.send_all.normalize', points: [500, 1000]},
    {metric: 'metric.send_all.normalize', points: 1000}
  ];
  metric.send_all(metrics);

  // Assert we called `client.request` with the correct `points`
  t.assert(spy.calledOnce);
  const call_args = spy.getCall(0).args;
  // { body: series: [ {points: [], }, ] }
  const body = call_args[2].body;
  t.is(body.series.length, 3);

  // points = [ [<timestamp>, 500] ]
  let points = body.series[0].points;
  t.assert(Array.isArray(points));
  t.is(points.length, 1);
  t.is(points[0].length, 2);
  t.is(points[0][1], 500);

  // points = [ [<timestamp>, 500], [<timestamp>, 1000] ]
  points = body.series[1].points;
  t.assert(Array.isArray(points));
  t.is(points.length, 2);
  t.is(points[0].length, 2);
  t.is(points[0][1], 500);
  t.is(points[1].length, 2);
  t.is(points[1][1], 1000);

  // points = [ [<timestamp>, 1000] ]
  points = body.series[2].points;
  t.assert(Array.isArray(points));
  t.is(points.length, 1);
  t.is(points[0].length, 2);
  t.is(points[0][1], 1000);
});

test('should properly send metric type', t => {
  const {metric, spy} = t.context;

  // Make our api call
  const metrics = [{metric: 'metric.send.counter', points: 5, type: 'count'}];
  metric.send_all(metrics);

  // Assert we properly called `client.request`
  t.assert(spy.calledOnce);
  const call_args = spy.getCall(0).args;
  // Method and endpoint are correct
  t.is(call_args[0], 'POST');
  t.is(call_args[1], '/series');

  // Properly formatted body
  // { body: series: [ {metric: "metric.send.counter", host: undefined, tags: undefined, type: "count"} ] }
  // DEV: host/tags are optional and should be undefined for this case
  const data = call_args[2];
  t.assert(_.has('body', data));
  t.assert(_.has('series', data.body));

  // Assert we have only 1 series
  // series = [ {metric: "", ...}, ... ]
  const series = data.body.series;
  t.assert(Array.isArray(series));
  t.is(series.length, 1);

  // Assert the first series is properly formatted
  // first_series = {metric: "", type: "count", points: [], ...}
  const first_series = series[0];
  t.is(first_series.metric, 'metric.send.counter');
  t.assert(Array.isArray(first_series.points));
  t.deepEqual(first_series.type, 'count');
});

test('should properly send metric_type as type', t => {
  const {metric, spy} = t.context;

  // Make our api call
  const metrics = [{metric: 'metric.send.counter', points: 5, metric_type: 'count'}];
  metric.send_all(metrics);

  // Assert we properly called `client.request`
  t.assert(spy.calledOnce);
  const call_args = spy.getCall(0).args;
  // Method and endpoint are correct
  t.is(call_args[0], 'POST');
  t.is(call_args[1], '/series');

  // Properly formatted body
  // { body: series: [ {metric: "metric.send.counter", host: undefined, tags: undefined, type: "count"} ] }
  // DEV: host/tags are optional and should be undefined for this case
  const data = call_args[2];
  t.assert(_.has('body', data));
  t.assert(_.has('series', data.body));

  // Assert we have only 1 series
  // series = [ {metric: "", ...}, ... ]
  const series = data.body.series;
  t.assert(Array.isArray(series));
  t.is(series.length, 1);

  // Assert the first series is properly formatted
  // first_series = {metric: "", type: "count", points: [], ...}
  const first_series = series[0];
  t.is(first_series.metric, 'metric.send.counter');
  t.assert(Array.isArray(first_series.points));
  t.deepEqual(first_series.type, 'count');
});

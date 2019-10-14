const test = require('ava');
const _ = require('lodash/fp');
const sinon = require('sinon');
const Client = require('../src/client');
const Metric = require('../src/api/metric');

test.beforeEach(t => {
  const client = new Client({});
  const spy = sinon.spy(client, 'request');
  const metric = Metric(client);
  t.context.metric = metric;
  t.context.spy = spy;
});

test('#send should make a valid api call', t => {
  const {metric, spy} = t.context;
  // Make our api call
  const now = parseInt(new Date().getTime() / 1000);
  metric.send('metric.send', [[now, 500]]);

  // Assert we properly called `client.request`
  t.true(spy.calledOnce);
  const call_args = spy.getCall(0).args;
  // Method and endpoint are correct
  t.is(call_args[0], 'POST');
  t.is(call_args[1], '/series');

  // Properly formatted body
  // { body: series: [ {metric: "metric.send", host: undefined, tags: undefined, type: undefined} ] }
  // DEV: host/tags/type are optional and should be undefined for this case
  const data = call_args[2];
  t.true(_.has('body', data));
  t.true(_.has('series', data.body));

  // Assert we have only 1 series
  // series = [ {metric: "", ...}, ... ]
  const series = data.body.series;
  t.true(Array.isArray(series));
  t.is(series.length, 1);

  // Assert the first series is properly formatted
  // first_series = {metric: "", points: [], ...}
  const first_series = series[0];
  t.is(first_series.metric, 'metric.send');
  t.true(Array.isArray(first_series.points));
  t.deepEqual(first_series.points, [[now, 500]]);

  // These keys are optional and should be set, but undefined
  t.true(_.has('host', first_series));
  t.is(first_series.host, undefined);
  t.true(_.has('tags', first_series));
  t.is(first_series.tags, undefined);
  t.true(_.has('type', first_series));
  t.is(first_series.type, undefined);
});

test('should properly normalize values to points', t => {
  const {metric, spy} = t.context;
  // Make our api call
  metric.send('metrics.send.normalize', 500);

  // Assert we called `client.request` with the correct `points`
  t.true(spy.calledOnce);
  const call_args = spy.getCall(0).args;
  // { body: series: [ {points: [], }, ] }
  const body = call_args[2].body;
  t.is(body.series.length, 1);

  // points = [ [<timestamp>, 500] ]
  const points = body.series[0].points;
  t.true(Array.isArray(points));
  t.is(points.length, 1);

  // point = [<timestamp>, 500]
  const point = points[0];
  t.true(Array.isArray(point));
  t.is(point.length, 2);
  t.is(point[1], 500);
});

test('should properly normalize array of values to points', t => {
  const {metric, spy} = t.context;
  // Make our api call
  metric.send('metrics.send.normalize', [500, 1000]);

  // Assert we called `client.request` with the correct `points`
  t.true(spy.calledOnce);
  const call_args = spy.getCall(0).args;
  // { body: series: [ {points: [], }, ] }
  const body = call_args[2].body;
  t.is(body.series.length, 1);

  // points = [ [<timestamp>, 500], [<timestamp>, 1000] ]
  const points = body.series[0].points;
  t.true(Array.isArray(points));
  t.is(points.length, 2);

  // point = [<timestamp>, 500]
  let point = points[0];
  t.true(Array.isArray(point));
  t.is(point.length, 2);
  t.is(point[1], 500);

  // point = [<timestamp>, 1000]
  point = points[1];
  t.true(Array.isArray(point));
  t.is(point.length, 2);
  t.is(point[1], 1000);
});

test('should not normalize correctly formatted points', t => {
  const {metric, spy} = t.context;
  // Make our api call
  const now = parseInt(new Date().getTime() / 1000);
  metric.send('metrics.send.normalize', [[now, 1000]]);

  // Assert we called `client.request` with the correct `points`
  t.true(spy.calledOnce);
  const call_args = spy.getCall(0).args;
  // { body: series: [ {points: [], }, ] }
  const body = call_args[2].body;
  t.is(body.series.length, 1);

  // points = [ [<timestamp>, 1000], ]
  const points = body.series[0].points;
  t.true(Array.isArray(points));
  t.is(points.length, 1);

  // point = [<timestamp>, 500]
  const point = points[0];
  t.true(Array.isArray(point));
  t.deepEqual(point, [now, 1000]);
});

test('should properly set metric type', t => {
  const {metric, spy} = t.context;
  // Make our api call
  metric.send('metrics.send.counter', 5, {type: 'count'});

  // Assert we called `client.request` with the correct `points`
  t.true(spy.calledOnce);
  const call_args = spy.getCall(0).args;
  // { body: series: [ {points: [], }, ] }
  const body = call_args[2].body;
  t.is(body.series.length, 1);

  // Assert we have only 1 series
  // series = [ {metric: "", ...}, ... ]
  const series = body.series;
  t.true(Array.isArray(series));
  t.is(series.length, 1);

  // Assert the first series is properly formatted
  // first_series = {metric: "", type: "count", points: [], ...}
  const first_series = series[0];
  t.is(first_series.metric, 'metrics.send.counter');
  t.true(_.has('type', first_series));
  t.is(first_series.type, 'count');
});

test('should properly set convert metric_type to type', t => {
  const {metric, spy} = t.context;
  // Make our api call
  metric.send('metrics.send.counter', 5, {metric_type: 'count'});

  // Assert we called `client.request` with the correct `points`
  t.true(spy.calledOnce);
  const call_args = spy.getCall(0).args;
  // { body: series: [ {points: [], }, ] }
  const body = call_args[2].body;
  t.is(body.series.length, 1);

  // Assert we have only 1 series
  // series = [ {metric: "", ...}, ... ]
  const series = body.series;
  t.true(Array.isArray(series));
  t.is(series.length, 1);

  // Assert the first series is properly formatted
  // first_series = {metric: "", type: "count", points: [], ...}
  const first_series = series[0];
  t.is(first_series.metric, 'metrics.send.counter');
  t.true(_.has('type', first_series));
  t.is(first_series.type, 'count');
});

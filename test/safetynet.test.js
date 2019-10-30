const test = require('ava');
const _ = require('lodash/fp');

test('I can load client without crash', t => {
  const datadogClient = require('../src');
  t.assert(datadogClient);
});

test('Client expose a constructor and some utils', t => {
  const datadogClient = require('../src');
  t.assert(_.isFunction(datadogClient));
  t.assert(_.isFunction(datadogClient.now));
  t.assert(datadogClient.OK === 0);
  t.assert(datadogClient.WARNING === 1);
  t.assert(datadogClient.CRITICAL === 2);
  t.assert(datadogClient.UNKNOWN === 3);
});

test('Client expose an initialy method and api entrypoint', t => {
  const datadogClient = require('../src');
  t.assert(datadogClient.metric);
  t.assert(datadogClient.infrastructure);
  t.assert(datadogClient.user);
  t.assert(datadogClient.comment);
  // Sorry wont do all of them
  t.assert(_.isFunction(datadogClient.metric.send));
});

test('Client is a client constructor, that provides access to all api', t => {
  // inception title
  const DatadogClient = require('../src');
  const datadog = new DatadogClient();
  t.assert(datadog.metric);
  t.assert(datadog.infrastructure);
  t.assert(datadog.user);
  t.assert(datadog.comment);
  // Sorry wont do all of them
  t.assert(_.isFunction(datadog.metric.send));
});

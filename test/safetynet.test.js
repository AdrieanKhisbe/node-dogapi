const test = require('ava');
const _ = require('lodash/fp');

const EDIT = ['create', 'update', 'remove'];
const CONSULT = ['get', 'getAll'];
const ALL_APIS = {
  comment: EDIT,
  downtime: [...EDIT, ...CONSULT],
  embed: ['create', 'revoke', ...CONSULT],
  event: ['create', 'get', 'query'],
  graph: ['snapshot'], // createEmbed
  host: ['mute', 'unmute'],
  infrastructure: ['search'],
  metric: ['send', 'send_all', 'query'],
  monitor: [...EDIT, ...CONSULT, 'mute', 'muteAll', 'unmute', 'unmuteAll'],
  screenboard: [...EDIT, ...CONSULT, 'share'],
  search: ['query'],
  serviceCheck: ['check'],
  tag: [...EDIT, ...CONSULT],
  timeboard: [...EDIT, ...CONSULT],
  user: ['invite']
};

test('I can load client without crash', t => {
  const datadogClient = require('..');
  t.assert(datadogClient);
});

test('Client expose a constructor and some utils', t => {
  const datadogClient = require('..');
  t.assert(_.isFunction(datadogClient));
  t.assert(_.isFunction(datadogClient.now));
  t.assert(datadogClient.OK === 0);
  t.assert(datadogClient.WARNING === 1);
  t.assert(datadogClient.CRITICAL === 2);
  t.assert(datadogClient.UNKNOWN === 3);
});

test('Client expose an initialy method and api entrypoint', t => {
  const datadogClient = require('..');
  t.assert(datadogClient.metric);
  t.assert(datadogClient.infrastructure);
  t.assert(datadogClient.user);
  t.assert(datadogClient.comment);
  // Sorry wont do all of them
  t.assert(_.isFunction(datadogClient.metric.send));
});

test('Client is a client constructor, that provides access to all api', async t => {
  // inception title
  const expectedApis = _.keys(ALL_APIS);
  t.is(expectedApis.length, 15);
  const DatadogClient = require('..');
  const fakeClient = {
    callCount: 0,
    request() {
      this.callCount++;
      return Promise.resolve('stubbed');
    }
  };
  const datadog = new DatadogClient({client: fakeClient});

  for (const api of expectedApis) {
    t.assert(datadog[api]);
    for (const apiMethod of ALL_APIS[api]) {
      const method = _.get([api, apiMethod], datadog);
      t.true(_.isFunction(method), `datadog as no ${api}.${apiMethod} method`);
      if (api === 'metric') continue; // complex test are being done in dedicated files

      t.is(await method(), 'stubbed', `datadog method was not ${api}.${apiMethod} stubbed`);
    }
  }
});

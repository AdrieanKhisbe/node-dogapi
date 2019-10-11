datadog-client
==============

> Datadog API Node.JS Client :dog2:

:warning: This is a fork from [node-dogapi](https://github.com/brettlangdon/node-dogapi)

[![npm version](https://img.shields.io/npm/v/datadog-client.svg)](https://www.npmjs.com/package/datadog-client)
[![Build Status](https://travis-ci.org/omni-tools/node-datadog-client.svg?branch=master)](https://travis-ci.org/omni-tools/node-datadog-client)
[![Dependency Status](https://david-dm.org/omni-tools/node-datadog-client.svg)](https://david-dm.org/omni-tools/node-datadog-client)
[![codecov](https://codecov.io/gh/omni-tools/node-datadog-client/branch/master/graph/badge.svg)](https://codecov.io/gh/omni-tools/node-datadog-client)

# Documentation :books:
- Official Datadog API Documentation: http://docs.datadoghq.com/api/
- This fork `datadog-client` API Docs: https://omni-tools.github.io/node-datadog-client/
- Original `dogapi` API Docs: https://brettlangdon.github.io/node-dogapi/

## Clarification about this library

`dogapi` does not provide any functionality to talk to a local `dogstatsd` server.
This library is purely an interface to the HTTP api.

If you are looking for a good Datadog **StatsD** library, you can check out [node-dogstatsd](https://github.com/joybro/node-dogstatsd).
Or the more adopted [hot-shots](https://www.npmjs.com/package/hot-shots) supporting both **StatsD** and **DogStatsD**

## Installation
```bash
npm install datadog-client
```

## Configuration

You will need your Datadog **api key** as well as an **application key** to use `dogapi`.

:closed_lock_with_key: Keys can be found at: https://app.datadoghq.com/account/settings#api

```javascript
const dogapi = require('dogapi');

const options = {api_key: "YOUR_KEY_HERE", app_key: "YOUR_KEY_HERE"};

dogapi.initialize(options);
```

### HTTPS Proxy

If you are behind a proxy you need to a proxy agent. You can use the https proxy agent from
http://blog.vanamco.com/proxy-requests-in-node-js/ if you like.
To configure dogapi with the agent just add it to the options.

```javascript
const dogapi = require('dogapi');

//Code from http://blog.vanamco.com/proxy-requests-in-node-js/
const HttpsProxyAgent = require('./httpsproxyagent');

const options = {
  api_key: 'YOUR_KEY_HERE',
  app_key: 'YOUR_KEY_HERE',
  proxy_agent: new HttpsProxyAgent({
    proxyHost: "MY_PROXY_HOST",
    proxyPort: 3128
  })
};

dogapi.initialize(options);
```

## CLI Usage

`dogapi` now ships with a command line interface `dogapi` (or `datadog-cli`).

To use it you will need a `.dogapirc` file which meets the standards of https://github.com/dominictarr/rc

The config file must contain both `api_key` and `app_key` keys (you can find your datadog api and app keys here:
https://app.datadoghq.com/account/settings#api

Example:

```json
{
  "api_key": "<API_KEY>",
  "app_key": "<APP_KEY>"
}
```

### Usage

Please run `dogapi --help` to see current usage documentation for the tool.

Every api method available in `dogapi` is exposed via the cli tool.

## Major changes in 3.x.x
Al major improvements and eventuals breaking changes are **TO BE DESCRIBED HERE**

## Major changes from 1.x.x to 2.x.x
We have updated major versions for this library due to a backwards incompatible change to the argument format for `dogapi.metric.send` and `dogapi.metric.send_all`.

### dogapi.metric.send
Previously in `1.x.x`:

```javascript
dogapi.metric.send('metric.name', 50);
dogapi.metric.send('metric.name', [datatog.now(), 50]);
```

Now in `2.x.x`:

```javascript
dogapi.metric.send('metric.name', 50);
dogapi.metric.send('metric.name', [50, 100]);
dogapi.metric.send('metric.name', [[datadog.now(), 50]]);
```

### dogapi.metric.send_all
Previously in `1.x.x`:

```javascript
const metrics = [
  {metric: 'metric.name', points: [datadog.now(), 50]},
  {metric: 'metric.name', points: 50}
];
dogapi.metric.send_all(metrics);
```

Now in `2.x.x`:

```javascript
const metrics = [
  {metric: 'metric.name', points: [[datadog.now(), 50]]},
  {metric: 'metric.name', points: [50, 100]},
  {metric: 'metric.name', points: 50}
];
dogapi.metric.send_all(metrics);
```

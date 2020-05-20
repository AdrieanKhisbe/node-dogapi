const dogapi = require('..'); // use 'datadog-client' instead

const options = {
  api_key: 'YOUR_KEY_HERE',
  app_key: 'YOUR_KEY_HERE'
};

dogapi.initialize(options);

dogapi.metric.send('test', 1);

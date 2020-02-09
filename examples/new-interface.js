const Dogapi = require('..'); // use 'datadog-client' instead

const options = {
  api_key: 'YOUR_KEY_HERE',
  app_key: 'YOUR_KEY_HERE'
};

const dogapi = new Dogapi(options);

dogapi.metric.send('test', 1);

dogapi.event
  .create('Some event', '**THIS** happened')
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.error(err);
  });

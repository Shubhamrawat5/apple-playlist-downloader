const prompt = require('prompt');
const app = require('./app');

const properties = [
  {
    name: 'url',
    validator:  /^\S*$/,
    warning: 'URLs cannot contain spaces'
  },
];

prompt.start();

prompt.get(properties, function (err, result) {
  if (err) {
    return onErr(err);
  }
  global.url = result.url;

  console.log('Command-line input received:');
  console.log('  url: ' + result.url);
  app(result.url);

});

function onErr(err) {
  console.log(err);
  return 1;
}

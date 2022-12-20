const prompt = require('prompt');
const app = require('./app/app');

const properties = [
  {
    name: 'url',
    validator:  /^\S*$/,
    warning: 'URLs cannot contain spaces'
  },
];

/* test data 
uncomment for to enable
*/

// global.url = "https://music.apple.com/us/album/awakening/350512056"; app(global.url);



// comment below to disable prompt
prompt.start();

prompt.get(properties, function (err, result) {
  if (err) {
    return onErr(err);
  }
  global.url = result.url;

  console.log('Command-line input received:');
  console.log('  url: ' + result.url);
  if (result.url.indexOf("library/albums") !== -1)  {
    throw new Error("This is an album part of a user libray. THis script cannot access non public URLs. Try getting the public URL of the album.");
  }
  app(result.url);

});

function onErr(err) {
  console.log(err);
  return 1;
}

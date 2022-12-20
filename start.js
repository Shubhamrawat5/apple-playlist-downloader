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

  // If a user is signed into Apple music and browsing Apple music albums added to one's library, these are not publically avalaible for Axios to scrape. The URL will not contain any info, for example https://music.apple.com/library/albums/l.1h5jx6A will be a blank page. The only thing we can do is error out. 

  if (result.url.indexOf("library/albums") !== -1)  {
    console.log("=====================");
    throw new Error("This is an album part of a user libray. THis script cannot access non public URLs. Try getting the public URL of the album. Hint, use google and search 'Apple Music ARTIST NAME - ALBUM NAME'");
    console.log("=====================");
  }
  app(result.url);

});

function onErr(err) {
  console.log(err);
  return 1;
}

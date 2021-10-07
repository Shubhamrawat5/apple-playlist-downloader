const fs = require("fs");
request = require("request");
const axios = require("axios");
const clipboardy = require('clipboardy');

const { exec } = require("child_process"); // NEW

let songsList = [];
const startDownloading = () => {
  index += 1;
  if (index === songsList.length) {
    console.log("\n#### ALL SONGS ARE DOWNLOADED!! ####\n");
    console.log("Songs that are not found:-");
    let i = 1;
    for (let song of notFound) {
      console.log(`${i} - ${song}`);
      i += 1;
    }
    if (i === 1) console.log("None!");
    return;
  }
  let song = songsList[index].name;
  let singer = songsList[index].singer;



startDownloading()
};


console.log("STARTING....");
let playlist = require("./apple_playlist");
playlist.getPlaylist().then((res) => {
  if (res === "Some Error") {
    //wrong url
    console.log(
      "Error: maybe the url you inserted is not of apple music playlist or check your connection!"
    );
    return;
  }
  console.log('Get tracklist from playlist : '+res.playlist +' by ' + res.user)
  songsList = res.songs;
  //console.log(JSON.stringify(songsList))
  try{
  clipboardy.writeSync(JSON.stringify(songsList));
  console.log('Full JSON data copied to clipboard !')
  console.log('Copy it into the searcher.py file line 68 in the tree quotes. Then execute "python3 searcher.py" and wait')
}
catch{
  console.log(JSON.stringify(songsList))
  console.log('Failed to copy to clipboard, please copy manually the text above.')
}
  //execute = 'python3 searcher.py `'+JSON.stringify(songsList)+'`';
  //console.log(execute)
  //exec(execute, (err, stdout, stderr) => {
  //if (err) {
    // node couldn't execute the command
    //return;
  //}

  // the *entire* stdout and stderr (buffered)
  //console.log(`stdout: ${stdout}`);
  //console.log(`stderr: ${stderr}`);
//});



});

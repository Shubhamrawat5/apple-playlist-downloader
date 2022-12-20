module.exports = function app () { 

const fs = require("fs");
const startDownloading = require("./startDownloading");

//TODO: Globals aren't ideal but refactoring for sanity to first.
global.index = -1;
global.songsList = [];
global.total = 0;
global.notFound = [];

console.log("STARTING....");

let playlist;
playlist = require("./getPlaylist");

playlist.getPlaylist().then((res) => {
  if (res === "Some Error") {
    //wrong url
    console.log(
      "Error: maybe the url you inserted is not of apple music playlist or check your connection!"
    );
    return;
  }
  songsList = res.songs;
  total = res.total;
  console.log("Total songs:" + total);

  //create folder
  let dir = __dirname + "../songs";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  startDownloading();
});

}
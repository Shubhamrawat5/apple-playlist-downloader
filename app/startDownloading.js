const getURL = require("./getURL");


module.exports = startDownloading = () => {
    global.index += 1;
    if (global.index === global.songsList.length) {
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
    let song = global.songsList[index].name;
    let artist = global.songsList[index].artist;
    let album = global.songsList[index].album;
    // this will show you how the query started
    // console.log("ARTIST:", artist, "ALBUM:", album, "SONG:", song)
    getURL(song, artist, album);
  };
  
const axios = require("axios");
const JSSoup = require("jssoup").default;
const htmlEntities = require("html-entities");

module.exports.getPlaylist = async () => {
  try {
    let playlistObj = {};
    let url =
      "https://music.apple.com/in/playlist/shubham/pl.u-GgA5klRUo9y91A0?ls"; //put your playlist url
    const response = await axios.get(url);
    let htmlContent = response.data;
    let soup = new JSSoup(htmlContent);

    //scraping...
    const playlistHeaderBlock = soup.find("div", "album-header-metadata");
    let playlistName = playlistHeaderBlock.find("h1").text.trim();
    let playlistUser = playlistHeaderBlock.find("h2").text.trim();
    //   console.log(playlistName, playlistUser);
    playlistObj.playlist = htmlEntities.decode(playlistName);
    playlistObj.user = htmlEntities.decode(playlistUser);

    const tracksInfo = soup.findAll("div", "track"); //finding all songs info
    playlistObj.songs = [];

    for (let track of tracksInfo) {
      let songName = track.find("div", "song-name ").text;
      let singerNames = track.find("div", "by-line").text;
      singerNames = singerNames.replace(/\s{2,10}/g, ""); //remove spaces
      songName = songName.replace(/\?|<|>|\*|"|:|\||\/|\\/g, ""); //removing special characters which are not allowed in file name
      playlistObj.songs.push({
        name: htmlEntities.decode(songName),
        singer: htmlEntities.decode(singerNames),
      });
    }
    playlistObj.total = playlistObj.songs.length; //total songs count
    // console.log(playlistObj);
    return playlistObj;
  } catch {
    return "Some Error";
  }
};

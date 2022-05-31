const axios = require("axios");
const JSSoup = require("jssoup").default;
const htmlEntities = require("html-entities");

module.exports.getPlaylist = async (url) => {
  try {
    let playlistObj = {};
    const response = await axios.get(url);
    let htmlContent = response.data;
    let soup = new JSSoup(htmlContent);

    //scraping...
    const playlistHeaderBlock = soup.find("div", "album-header-metadata");
    let playlistName = playlistHeaderBlock.find("h1").text.trim();
    let playlistUser = playlistHeaderBlock
      .find("div", "product-creator")
      .text.trim();
    playlistObj.playlist = htmlEntities.decode(playlistName);
    playlistObj.user = htmlEntities.decode(playlistUser);

    const tracksInfo = soup.findAll("div", "songs-list-row"); //finding all songs info
    playlistObj.songs = [];

    for (let track of tracksInfo) {
      let songName = track.find("div", "songs-list-row__song-name").text;
      let singerNames = track.find("div", "songs-list-row__by-line").text;
      let album = track.find("div", "songs-list__col--album").text;
      singerNames = singerNames.replace(/\s{2,10}/g, ""); //remove spaces
      songName = songName.replace(/\?|<|>|\*|"|:|\||\/|\\/g, ""); //removing special characters which are not allowed in file name
      playlistObj.songs.push({
        name: htmlEntities.decode(songName),
        singer: htmlEntities.decode(singerNames),
        album: htmlEntities.decode(album),
      });
    }
    playlistObj.total = playlistObj.songs.length; //total songs count
    return playlistObj;
  } catch {
    return "Some Error";
  }
};

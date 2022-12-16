const axios = require("axios");
const JSSoup = require("jssoup").default;
const htmlEntities = require("html-entities");
const urlDetect = require("./urlDetect");

module.exports.getPlaylist = async () => {
  try {
    let playlistObj = {};
    let url =  urlDetect("url");

    const response = await axios.get(url);
    let htmlContent = response.data;
    let soup = new JSSoup(htmlContent);

    //scraping...
    const playlistHeaderBlock = soup.find("div", "container-detail-header");
    let playlistName, playlistUser;

    try {
      playlistName = playlistHeaderBlock.find("h1").text.trim();
      playlistUser = playlistHeaderBlock
        .find("p", "headings__subtitles")
        .text.trim();
    } catch (err) {
      playlistName = "";
      playlistUser = "";
    }

    // console.log(playlistName, playlistUser);
    playlistObj.playlist = htmlEntities.decode(playlistName);
    playlistObj.user = htmlEntities.decode(playlistUser);

    const tracksInfo = soup.findAll("div", "songs-list-row"); //finding all songs info
    playlistObj.songs = [];

    for (let track of tracksInfo) {
      let songName = track.find("div", "songs-list__col--song").text;
      console.log(songName);
      let singerNames = track.find("div", "songs-list__col--secondary").text;
      let album = track.find("div", "songs-list__col--tertiary").text;
      singerNames = singerNames.replace(/\s{2,10}/g, ""); //remove spaces
      songName = songName.replace(/\?|<|>|\*|"|:|\||\/|\\/g, ""); //removing special characters which are not allowed in file name
      playlistObj.songs.push({
        name: htmlEntities.decode(songName),
        singer: htmlEntities.decode(singerNames),
        album: htmlEntities.decode(album),
      });
    }
    playlistObj.total = playlistObj.songs.length; //total songs count
    // console.log(playlistObj);
    return playlistObj;
  } catch (err) {
    // console.log(err);
    return "Some Error";
  }
};

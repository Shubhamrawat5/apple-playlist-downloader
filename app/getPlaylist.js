const axios = require("axios");
const JSSoup = require("jssoup").default;
const htmlEntities = require("html-entities");
const findSongs = require("./findSongs");


module.exports.getPlaylist = async () => {
  try {
    let playlistObj = {};
    const response = await axios.get(global.url);
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
    playlistObj.playlist = htmlEntities.decode(playlistName);
    playlistObj.user = htmlEntities.decode(playlistUser);

    console.log("playlistObj", playlistObj)


    // The structure of album pages and playlist pages differs
    playlistObj.songs = findSongs(soup, playlistUser, playlistName);

    
    playlistObj.total = playlistObj.songs.length; //total songs count
    // console.log(playlistObj);
    return playlistObj;
  } catch (err) {
    // console.log(err);
    return "Some Error";
  }
};

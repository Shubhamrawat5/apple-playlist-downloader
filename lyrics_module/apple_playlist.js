const axios = require("axios");
const JSSoup = require("jssoup").default;
const htmlEntities = require("html-entities");
module.exports.getPlaylist = async () => {
  try {
    let playlistObj = {};
    let url =
      ""; //put your playlist url
    const response = await axios.get(url);
    let htmlContent = response.data;
    let soup = new JSSoup(htmlContent);

    //scraping...
    const playlistHeaderBlock = soup.find("div", "album-header-metadata");
    let playlistName = playlistHeaderBlock.find("h1").text.trim();
    let playlistUser = playlistHeaderBlock
      .find("div", "product-creator")
      .text.trim();
    // console.log(playlistName, playlistUser);
    playlistObj.playlist = htmlEntities.decode(playlistName);
    playlistObj.user = htmlEntities.decode(playlistUser);

    const tracksInfo = soup.findAll("div", "songs-list-row"); //finding all songs info
    playlistObj.songs = [];

    for (let track of tracksInfo) {
      let songName = track.find("div", "songs-list-row__song-name").text;
      let singerNames = track.find("div", "songs-list-row__by-line").text;
      singerNames = singerNames.replace(/\s{2,10}/g, ""); //remove spaces
      songName = songName.replace(/\?|<|>|\*|"|:|\||\/|\\/g, ""); //removing special characters which are not allowed in file name
      singerNames = singerNames.replace(" and ", ", ");
      singerNames = singerNames.replace(" et ", ", ");
      singerNames = singerNames.replace(" und ", ", ");
      singerNames = singerNames.replace(" & ", ", ");
      songName = songName.replace(" and ", ", ");
      songName = songName.replace(" et ", ", ");
      songName = songName.replace(" und ", ", ");
      songName = songName.replace(" & ", ", ");
      var split_artists = singerNames.split(", "); // Separate differents artists : for Riton, Kah-Lo it will search for Riton, Kah-Lo - Riton - Kah-Lo
      if (split_artists.length !== 1){
        split_artists.splice(2, 0, singerNames);
      }
      for (let i = 0; i < split_artists.length; i++) {
        artist = split_artists[i];
        playlistObj.songs.push({
        name: htmlEntities.decode(songName),
        singer: htmlEntities.decode(artist),
        original_singer: htmlEntities.decode(singerNames)
      });
      }
    }
    playlistObj.total = playlistObj.songs.length; //total songs count
    // console.log(playlistObj);
    return playlistObj;
  } catch {
    return "Some Error";
  }
};


const axios = require("axios");
const htmlEntities = require("html-entities");

module.exports.getPlaylist = async (url) => {
  let playlistObj = {};
  let api = "https://api.fabdl.com/apple-music/get?url=";

  console.log("Playlist URL: ", url);
  const { data } = await axios.get(api + url);

  playlistObj.playlist = htmlEntities.decode(data.result.name);
  playlistObj.user = htmlEntities.decode(data.result.owner);
  playlistObj.songs = [];

  data.result.tracks.forEach((track) => {
    playlistObj.songs.push({
      name: htmlEntities.decode(track.name),
      singer: htmlEntities.decode(track.artists),
      duration_ms: track.duration_ms,
      image: htmlEntities.decode(track.image),
    });
  });

  return playlistObj;
};

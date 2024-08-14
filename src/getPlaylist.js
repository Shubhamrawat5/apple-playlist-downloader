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
      songName: htmlEntities.decode(track.name),
      singerName: htmlEntities.decode(track.artists),
      songDurationSec: Math.trunc(track.duration_ms / 1000),
      songImageUrl: htmlEntities.decode(track.image),
    });
  });
  // const axios = require("axios");
  // const htmlEntities = require("html-entities");

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
        songName: htmlEntities.decode(track.name),
        singerName: htmlEntities.decode(track.artists),
        songDurationSec: Math.trunc(track.duration_ms / 1000),
        songImageUrl: htmlEntities.decode(track.image),
      });
    });

    return playlistObj;
  };

  return playlistObj;
};

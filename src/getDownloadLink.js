const axios = require("axios");

const INFO_URL = "https://slider.kz/vk_auth.php?q=";
// const DOWNLOAD_URL = "https://slider.kz/download/";

module.exports.getDownloadLink = async (
  songName,
  singerName,
  songDurationSec
) => {
  let query = `${singerName}%20${songName}`.replace(/\s/g, "%20");

  const { data } = await axios.get(encodeURI(INFO_URL + query));

  // when no result then [{}] is returned so length is always 1, when 1 result then [{id:"",etc:""}]
  if (!data["audios"][""] || !data["audios"][""][0].id) {
    //no result
    console.log("==[ SONG NOT FOUND! ]== : " + songName);
    return null;
  }

  //avoid remix,revisited,mix
  // let i = 0;
  // let track = data["audios"][""][i];
  // let totalTracks = data["audios"][""].length;
  // while (i < totalTracks && /remix|revisited|reverb|mix/i.test(track.tit_art)) {
  //   i += 1;
  //   track = data["audios"][""][i];
  // }
  //if reach the end then select the first song
  // if (!track) {
  //   track = data["audios"][""][0];
  // }

  const songs = data["audios"][""];
  let songDownloadUrl = null;
  let songTitleFound = null;

  // Find by duration of song
  for (let i = 0; i < songs.length; i++) {
    if (songDurationSec === songs[i].duration) {
      songDownloadUrl = encodeURI(songs[i].url); // to replace unescaped characters from link
      songTitleFound = songs[i].tit_art.replace(/\?|<|>|\*|"|:|\||\/|\\/g, ""); //removing special characters which are not allowed in file name;
      break;
    }
  }

  if (songDownloadUrl && songTitleFound) {
    return { songDownloadUrl, songTitleFound };
  }
  return null;
};

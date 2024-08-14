// const axios = require("axios");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
// const youtubedl = require("youtube-dl-exec");

module.exports.getDownloadLink = async (songName, singerName) => {
  const r = await yts(`${songName} +" - "+${singerName}`);

  const videoID = r.all[0].url;

  let info = await ytdl.getInfo(videoID);

  let songDownloadUrl = videoID;
  let songTitleFound = info.videoDetails.title;

  if (songDownloadUrl && songTitleFound) {
    return { songDownloadUrl, songTitleFound };
  }
};

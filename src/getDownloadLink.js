const axios = require("axios");
const fs = require("fs");

const INFO_URL = "https://slider.kz/vk_auth.php?q=";
const DOWNLOAD_URL = "https://slider.kz/download/";

module.exports.getDownloadLink = async (song, singer) => {
  let query = (singer + "%20" + song).replace(/\s/g, "%20");
  // console.log(INFO_URL + query);
  const { data } = await axios.get(encodeURI(INFO_URL + query));

  // when no result then [{}] is returned so length is always 1, when 1 result then [{id:"",etc:""}]
  // console.log(encodeURI(INFO_URL + query));
  if (!data["audios"][""] || !data["audios"][""][0].id) {
    //no result
    console.log("==[ SONG NOT FOUND! ]== : " + song);
    notFound.push(song + " - " + singer);
    start();
    return;
  }

  //avoid remix,revisited,mix
  let i = 0;
  let track = data["audios"][""][i];
  let totalTracks = data["audios"][""].length;
  while (i < totalTracks && /remix|revisited|reverb|mix/i.test(track.tit_art)) {
    i += 1;
    track = data["audios"][""][i];
  }
  //if reach the end then select the first song
  if (!track) {
    track = data["audios"][""][0];
  }

  let link = track.url;
  link = encodeURI(link); //to replace unescaped characters from link

  return link;
};

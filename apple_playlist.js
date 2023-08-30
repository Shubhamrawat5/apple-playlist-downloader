const axios = require("axios");
const JSSoup = require("jssoup").default;
const htmlEntities = require("html-entities");

module.exports.getPlaylist = async () => {
  let playlistObj = {};
  let api = "https://api.fabdl.com/apple-music/get?url=";
  let url =
    "https://music.apple.com/fi/playlist/one-direction-essentials/pl.134ef3b46d32414e9b4b5a995a2f3ea7"; //put your playlist url

  console.log("Playlist URL: ", url);
  const { data } = await axios.get(api + url);

  playlistObj.playlist = data.result.name;
  playlistObj.user = data.result.owner;
  playlistObj.songs = [];

  data.result.tracks.forEach((track) => {
    playlistObj.songs.push({
      name: track.name,
      singer: track.artists,
      duration_ms: track.duration_ms,
      image: track.image,
    });
  });

  playlistObj.total = playlistObj.songs.length; //total songs count

  console.log("Total songs: ", playlistObj.total);
  return playlistObj;
};

// module.exports.getPlaylist = async () => {
//   let playlistObj = {};
//   let url =
//     "https://music.apple.com/fi/playlist/one-direction-essentials/pl.134ef3b46d32414e9b4b5a995a2f3ea7"; //put your playlist url

//   console.log("Playlist URL: ", url);
//   const response = await axios.get(url);
//   let htmlContent = response.data;

//   let soup = new JSSoup(htmlContent);

//   //scraping...
//   const playlistHeaderBlock = soup.find("div", "container-detail-header");
//   let playlistName, playlistUser;

//   try {
//     playlistName = playlistHeaderBlock.find("h1").text.trim();
//     playlistUser = playlistHeaderBlock
//       .find("div", "headings__subtitles")
//       .text.trim();
//   } catch (err) {
//     console.log(err);
//     playlistName = "";
//     playlistUser = "";
//   }

//   playlistObj.playlist = htmlEntities.decode(playlistName);
//   playlistObj.user = htmlEntities.decode(playlistUser);
//   console.log("Playlist Name: ", playlistName);
//   console.log("Playlist User: ", playlistUser);

//   // console.log(htmlContent);
//   const tracksInfo = soup.findAll("div", "songs-list-row"); //finding all songs info
//   playlistObj.songs = [];
//   console.log(tracksInfo);

//   for (let track of tracksInfo) {
//     let songName = track.find("div", "songs-list__col--song").text;
//     let singerNames = track.find("div", "songs-list__col--secondary").text;
//     let album = track.find("div", "songs-list__col--tertiary").text;
//     singerNames = singerNames.replace(/\s{2,10}/g, ""); //remove spaces
//     songName = songName.replace(/\?|<|>|\*|"|:|\||\/|\\/g, ""); //removing special characters which are not allowed in file name
//     playlistObj.songs.push({
//       name: htmlEntities.decode(songName),
//       singer: htmlEntities.decode(singerNames),
//       album: htmlEntities.decode(album),
//     });
//   }
//   playlistObj.total = playlistObj.songs.length; //total songs count
//   console.log("Total songs: ", playlistObj.total);
//   return playlistObj;
// };

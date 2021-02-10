const fs = require("fs");
var ProgressBar = require("progress");
const axios = require("axios");

const INFO_URL = "http://slider.kz/vk_auth.php?q=";
const DOWNLOAD_URL = "http://slider.kz/download/";
let index = -1;
let songsList = [];
let total = 0;
let notFound = [];

const download = async (song, url) => {
  let numb = index + 1;
  console.log(`(${numb}/${total}) Starting download: ${song}`);
  const { data, headers } = await axios({
    method: "GET",
    url: url,
    responseType: "stream",
  });

  //for progress bar...
  const totalLength = headers["content-length"];
  const progressBar = new ProgressBar("-> downloading [:bar] :percent :etas", {
    width: 40,
    complete: "=",
    incomplete: " ",
    renderThrottle: 1,
    total: parseInt(totalLength),
  });

  data.on("data", (chunk) => progressBar.tick(chunk.length));
  data.on("end", () => {
    console.log("DOWNLOADED!");
    startDownloading(); //for next song!
  });

  //for saving in file...
  data.pipe(fs.createWriteStream(`${__dirname}/songs/${song}.mp3`));
};

const getURL = async (song, singer) => {
  let query = (song + "%20" + singer).replace(/\s/g, "%20");
  // console.log(INFO_URL + query);
  const { data } = await axios.get(INFO_URL + query);

  if (data["audios"][""].length <= 1) {
    //no result
    console.log("==[ SONG NOT FOUND! ]== : " + song);
    notFound.push(song + " - " + singer);
    startDownloading();
    return;
  }

  let track = data["audios"][""][0];
  if (fs.existsSync(__dirname + "/songs/" + track.tit_art + ".mp3")) {
    console.log(index + 1 + "- Song already present!!!!! " + song);
    startDownloading(); //next song
    return;
  }

  let link = DOWNLOAD_URL + track.id + "/";
  link = link + track.duration + "/";
  link = link + track.url + "/";
  link = link + track.tit_art + ".mp3" + "?extra=";
  link = link + track.extra;
  link = encodeURI(link); //to replace unescaped characters from link
  download(track.tit_art, link);
};

const startDownloading = () => {
  index += 1;
  if (index === songsList.length) {
    console.log("\n#### ALL SONGS ARE DOWNLOADED!! ####\n");
    console.log("Songs that are not found:-");
    let i = 1;
    for (let song of notFound) {
      console.log(`${i} - ${song}`);
      i += 1;
    }
    if (i === 1) console.log("None!");
    return;
  }
  let song = songsList[index].name;
  let singer = songsList[index].singer;
  getURL(song, singer);
};

console.log("STARTING....");
let playlist = require("./apple_playlist");
playlist.getPlaylist().then((res) => {
  songsList = res.songs;
  total = res.total;
  console.log("Total songs:" + total);

  //create folder
  let dir = __dirname + "/songs";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  startDownloading();
});

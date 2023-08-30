const fs = require("fs");
const request = require("request");
const ProgressBar = require("progress");
const axios = require("axios");
const NodeID3 = require("node-id3");

const { getPlaylist } = require("./src/getPlaylist");
const { getDownloadLink } = require("./src/getDownloadLink");

const playlistUrl =
  "https://music.apple.com/fi/playlist/one-direction-essentials/pl.134ef3b46d32414e9b4b5a995a2f3ea7"; //put your playlist url

let index = -1;
let songList = [];
let totalSongs = 0;
let notFound = [];

const download = async (song, singer, image, link) => {
  try {
    let numb = index + 1;
    console.log(`(${numb}/${totalSongs}) Starting download: ${song}`);
    const { data, headers } = await axios({
      method: "GET",
      url: link,
      responseType: "stream",
    });

    //for progress bar...
    const totalLength = headers["content-length"];
    const progressBar = new ProgressBar(
      "-> downloading [:bar] :percent :etas",
      {
        width: 40,
        complete: "=",
        incomplete: " ",
        renderThrottle: 1,
        total: parseInt(totalLength),
      }
    );

    data.on("data", (chunk) => progressBar.tick(chunk.length));
    data.on("end", () => {
      singer = singer.replace(/\s{2,10}/g, "");
      console.log("   DOWNLOADED!");
      const filepath = `${__dirname}/songs/${song}.mp3`;

      let query_artwork_file = `${__dirname}/songs/${song}.jpg`;

      download_artwork(image, query_artwork_file, function () {
        const tags = {
          title: song,
          artist: singer,
          APIC: query_artwork_file,
        };
        const success = NodeID3.write(tags, filepath);
        console.log("WRITTEN TAGS");
        try {
          fs.unlinkSync(query_artwork_file);
        } catch (err) {
          console.error(err);
        }
        start();
        //for next song!
      });
    });

    //for saving in file...
    data.pipe(fs.createWriteStream(`${__dirname}/songs/${song}.mp3`));
  } catch (err) {
    console.log("Error:", err);
    start(); //for next song!
  }
};

const download_artwork = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

const start = async () => {
  index += 1;
  if (index === totalSongs) {
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
  let song = songList[index].name;
  let singer = songList[index].singer;
  let image = songList[index].image;

  if (fs.existsSync(__dirname + "/songs/" + song + ".mp3")) {
    console.log(
      "(" +
        (index + 1) +
        "/" +
        totalSongs +
        ") - Song already present!!!!! " +
        song
    );
    start(); //next song
    return;
  }

  const link = await getDownloadLink(song, singer);

  download(song, singer, image, link);
};

console.log("STARTING....");
getPlaylist(playlistUrl)
  .then((res) => {
    console.log("Playlist Name: ", res.playlist);
    console.log("User Name: ", res.user);
    console.log("Total songs: ", res.songs.length + "\n");

    songList = res.songs;
    totalSongs = res.songs.length;

    //create folder
    let dir = __dirname + "/songs";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    start();
  })
  .catch((err) => {
    console.log(err);
  });

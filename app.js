const fs = require("fs");
const ProgressBar = require("progress");
const axios = require("axios");
const NodeID3 = require("node-id3");
const prompt = require("prompt");
const youtubedl = require("youtube-dl-exec");
// var ProgressBar = require("progress");

const { getPlaylist } = require("./src/getPlaylist");
const { getDownloadLink } = require("./src/getDownloadLink");

let index = -1;
let songList = [];
let totalSongs = 0;
let notFound = [];

const downloadSong = async (
  songName,
  singerName,
  // songImageUrl,
  songDownloadUrl,
  songTitleFound
  // songDurationSec
) => {
  try {
    let numb = index + 1;
    console.log(`\n(${numb}/${totalSongs}) Starting download: ${songName}`);
    const { data, headers } = await axios({
      method: "GET",
      url: songDownloadUrl,
      responseType: "stream",
    });

    var bar = new ProgressBar("[:bar]  :percent :etas ", {
      total: 45,
    });
    var timer = setInterval(function () {
      bar.tick();
      if (bar.complete) {
        console.log(`\n ${songTitleFound} - Downloaded\n`);
        clearInterval(timer);
      }
    }, 100);

    data.on("end", async () => {
      singerName = singerName.replace(/\s{2,10}/g, "");
      console.log("Song Downloaded!");

      startNextSong();
    });

    //for saving in file...

    await youtubedl(songDownloadUrl, {
      format: "m4a",
      output: "./songs/" + songTitleFound + ".mp3",
      maxFilesize: "104857600",
      preferFreeFormats: true,
    });
    startNextSong();
  } catch (err) {
    console.log("Error:", err);
    startNextSong();
  }
};

const startNextSong = async () => {
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

  const { songName, singerName, songDurationSec } = songList[index];

  const res = await getDownloadLink(songName, singerName);

  if (res) {
    const { songDownloadUrl, songTitleFound } = res;
    if (fs.existsSync(`./songs/${songTitleFound}.mp3`)) {
      console.log(
        `\n(${
          index + 1
        }/${totalSongs}) - [ SONG ALREADY PRESENT ] : ${songName}`
      );
      startNextSong(); //next song
      return;
    }
    await downloadSong(
      songName,
      singerName,
      // songImageUrl,
      songDownloadUrl,
      songTitleFound,
      songDurationSec
    );
  } else {
    console.log(
      `\n(${index + 1}/${totalSongs}) - [ SONG NOT FOUND ] : ${songName}`
    );
    notFound.push(`${songName} - ${singerName}`);
    startNextSong();
  }
};

const start = async () => {
  prompt.start();
  const { Playlist_URL } = await prompt.get(["Playlist_URL"]);
  // "https://music.apple.com/fi/playlist/one-direction-essentials/pl.134ef3b46d32414e9b4b5a995a2f3ea7";

  try {
    const res = await getPlaylist(Playlist_URL);
    console.log("Playlist Name: ", res.playlist);
    console.log("User Name: ", res.user);
    console.log("Total songs: ", res.songs.length);

    songList = res.songs;
    totalSongs = res.songs.length;

    //create folder
    let dir = "./songs";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    startNextSong();
  } catch (err) {
    console.log(err);
  }
};

start();

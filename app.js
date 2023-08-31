const fs = require("fs");
const ProgressBar = require("progress");
const axios = require("axios");
const NodeID3 = require("node-id3");
const prompt = require("prompt");

const { getPlaylist } = require("./src/getPlaylist");
const { getDownloadLink } = require("./src/getDownloadLink");

let index = -1;
let songList = [];
let totalSongs = 0;
let notFound = [];

const downloadSong = async (
  songName,
  singerName,
  songImageUrl,
  songDownloadUrl,
  songTitleFound
) => {
  try {
    let numb = index + 1;
    console.log(`(${numb}/${totalSongs}) Starting download: ${songName}`);
    const { data, headers } = await axios({
      method: "GET",
      url: songDownloadUrl,
      responseType: "stream",
    });

    const filepath = `./songs/${songTitleFound}.mp3`;

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
    data.on("end", async () => {
      singerName = singerName.replace(/\s{2,10}/g, "");
      console.log("Song Downloaded!");

      let imageFilePath = `./songs/${songTitleFound}.jpg`;

      await downloadImage(songImageUrl, imageFilePath);

      const tags = {
        title: songName,
        artist: singerName,
        APIC: imageFilePath,
      };

      NodeID3.write(tags, filepath);
      console.log("WRITTEN TAGS");

      try {
        fs.unlinkSync(imageFilePath);
      } catch (err) {
        console.error(err);
      }
      startNextSong();
    });

    //for saving in file...
    data.pipe(fs.createWriteStream(filepath));
  } catch (err) {
    console.log("Error:", err);
    startNextSong();
  }
};

const downloadImage = async (songImageUrl, imageFilePath) => {
  try {
    const response = await axios({
      method: "GET",
      url: songImageUrl,
      responseType: "stream",
    });

    // Create a write stream to save the image
    const writer = fs.createWriteStream(imageFilePath);

    // Pipe the response data into the writer stream
    response.data.pipe(writer);

    // Wait for the image to finish downloading
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log("Image downloaded!");
  } catch (error) {
    console.error("Error downloading image:", error.message);
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

  const { songName, singerName, songImageUrl, songDurationSec } =
    songList[index];

  const { songDownloadUrl, songTitleFound } = await getDownloadLink(
    songName,
    singerName,
    songDurationSec
  );

  if (songDownloadUrl && songTitleFound) {
    if (fs.existsSync(`./songs/${songTitleFound}.mp3`)) {
      console.log(
        `(${index + 1}/${totalSongs}) - Song already present!! ${songName}`
      );
      startNextSong(); //next song
      return;
    }
    await downloadSong(
      songName,
      singerName,
      songImageUrl,
      songDownloadUrl,
      songTitleFound
    );
  } else {
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

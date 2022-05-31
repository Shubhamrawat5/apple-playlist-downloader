#! /usr/bin/env node
const { cwd } = require('node:process');
const fs = require("fs");
const request = require("request");
const ProgressBar = require("progress");
const axios = require("axios");
const NodeID3 = require("node-id3");
const itunesAPI = require("node-itunes-search");
const minimist = require('minimist');

const INFO_URL = "https://slider.kz/vk_auth.php?q=";
const DOWNLOAD_URL = "https://slider.kz/download/";
let index = -1;
let songsList = [];
let total = 0;
let notFound = [];
let songsFound = [];

const download = async (song, url, song_name, singer_names, query_artwork) => {
  try {
    let numb = index + 1;
    console.log(`(${numb}/${total}) Starting download: ${song}`);
    const { data, headers } = await axios({
      method: "GET",
      url: url,
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
      singer_names = singer_names.replace(/\s{2,10}/g, "");
      console.log("DOWNLOADED!");
      const filepath = `${dir}/${song}.mp3`;
      //Replace all connectives by a simple ','
      singer_names = singer_names.replace(" and ", ", ");
      singer_names = singer_names.replace(" et ", ", ");
      singer_names = singer_names.replace(" und ", ", ");
      //Search track informations using the Itunes library
      const searchOptions = new itunesAPI.ItunesSearchOptions({
        term: query_artwork, // All searches require a single string query.

        limit: 1, // An optional maximum number of returned results may be specified.
      });
      //Use the result to extract tags
      try {
      itunesAPI.searchItunes(searchOptions).then((result) => {
        try {
          // Get all the tags and cover art of the track using node-itunes-search and write them with node-id3
          let maxres = result.results[0]["artworkUrl100"].replace(
            "100x100",
            "3000x3000"
          );
          let year = result.results[0]["releaseDate"].substring(0, 4);
          let genre = result.results[0]["primaryGenreName"];//.replace(/\?|<|>|\*|"|:|\||\/|\\/g,"");
          let trackNumber = result.results[0]["trackNumber"];
          let trackCount = result.results[0]["trackCount"];
          trackNumber = trackNumber + "/" + trackCount;
          let album = result.results[0]["collectionName"];//.replace(/\?|<|>|\*|"|:|\||\/|\\/g,"")
          let query_artwork_file = song + ".jpg";
          download_artwork(maxres, query_artwork_file, function () {
            const tags = {
              TALB: album,
              title: song_name,
              artist: singer_names,
              APIC: query_artwork_file,
              year: year,
              trackNumber: trackNumber,
              genre: genre,
            };
            const success = NodeID3.write(tags, filepath);
            console.log("WRITTEN TAGS");
                    songsFound.push({
          songname: song_name,
          artist: singer_names,
      });
            try {
              fs.unlinkSync(query_artwork_file);
              //file removed
            } catch (err) {
              console.error(err);
            }
            startDownloading();
            //for next song!
          });
        } catch {
          console.log("Full tags not found for " + song_name);
          const tags = {
            title: song_name,
            artist: singer_names,
          };
          //console.log(tags);
          const success = NodeID3.write(tags, filepath);
          console.log("WRITTEN TAGS (Only artist name and track title)");
          songsFound.push({
          songname: song_name,
          artist: singer_names,
      });
          startDownloading();
        }
      });
    }
    catch{
                console.log("Full tags not found for " + song_name);
          const tags = {
            title: song_name,
            artist: singer_names,
          };
          //console.log(tags);
          const success = NodeID3.write(tags, filepath);
          console.log("WRITTEN TAGS (Only artist name and track title)");
          songsFound.push({
          songname: song_name,
          artist: singer_names,
      });
          startDownloading();
    }
    });

    //for saving in file...
    data.pipe(fs.createWriteStream(`${dir}/${song}.mp3`));
  } catch {
    console.log("some error came!");
    startDownloading(); //for next song!
  }
};
const download_artwork = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};
const getURL = async (song, singer, album) => {
  let query = (singer + "%20" + song).replace(/\s/g, "%20");
  const { data } = await axios.get(encodeURI(INFO_URL + query));

  // when no result then [{}] is returned so length is always 1, when 1 result then [{id:"",etc:""}]
  if (!data["audios"][""][0].id) {
    //no result
    console.log("==[ SONG NOT FOUND! ]== : " + song);
    notFound.push(song + " - " + singer);
    startDownloading();
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
  let songName = track.tit_art.replace(/\?|<|>|\*|"|:|\||\/|\\/g, ""); //removing special characters which are not allowed in file name

  if (fs.existsSync(dir + "/" + songName + ".mp3")) {
    let numb = index + 1;
    console.log(
      "(" + numb + "/" + total + ") - Song already present!!!!! " + song
    );
    startDownloading(); //next song
    return;
  }
  
  let link = DOWNLOAD_URL + track.id + "/";
  link = link + track.duration + "/";
  link = link + track.url + "/";
  link = link + songName + ".mp3" + "?extra=";
  link = link + track.extra;
  link = encodeURI(link); //to replace unescaped characters from link
  artwork_query = encodeURI(track.tit_art + ' ' + album);
  download(songName, link, song, singer, artwork_query);
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
      process.exit(0)
  }
  let song = songsList[index].name;
  let singer = songsList[index].singer;
  let album = songsList[index].album;
  getURL(song, singer, album);
};

console.log("STARTING....");
//Initializing variables
let playlist = require("./apple_playlist");
let dir = "";
let playlistUrl = ""; 
let urlWithoutParameter = false;
const workingDir = process.cwd();
let args = minimist(process.argv.slice(2), {
    default: {
        h: false,
        help: false,
        u: '',
        url: '',
        p: workingDir,
        path: workingDir,
        d: false,
        dcd: false
    },
});
let args2 = process.argv.slice(2);
let possibleUrl = args2.filter(s=>~s.indexOf("music.apple.com"));
if (Object.keys(possibleUrl).length == 1) {
  playlistUrl = possibleUrl[0];
  urlWithoutParameter = true;
}
if (args.h == true || args.help){
  console.log(`HELP \n\n(Required)   / -u / --url "URL" : Download playlist with provided URL\n\n(Optional) -p / --path /path/to/song/folder : Download songs to provided path, default : current directory.\n\n(Optional) -d / --dcd : Won't use/create ApdSongs folder in the path.\n\n(Optional) -h / --help : Shows current message\n\nExample :\napd "url"`);
  process.exit(0)
}
else if (args.u == '' && args.url == '' && !urlWithoutParameter){
  console.log('Please provide an url. Type apd -h for help.');
  process.exit(1)
}
else if (!urlWithoutParameter) {
  if (args.u == ''){
    playlistUrl = args.url;
  }
  else {
    playlistUrl = args.u;
  }
}
// check if directory exists
if (!fs.existsSync(args.p) || !fs.existsSync(args.path)) {
    console.log('Provided path does not exists. Type apd -h for help.');
    process.exit(1)
}
let basePath = "";
if (args.p == workingDir && args.path == workingDir) {
  basePath = workingDir;
}
else if (args.p != workingDir) {
  basePath = args.p;
}
else {
  basePath = args.path;
}
playlist.getPlaylist(playlistUrl).then((res) => {
  if (res === "Some Error") {
    //wrong url
    console.log(
      "Error: maybe the url you inserted is not of apple music playlist or check your connection!"
    );
    process.exit(1)
  }
  songsList = res.songs;
  total = res.total;
  console.log("Total songs:" + total);
  if (args.dcd || args.d) {
    dir = basePath;
  }
  else {
    //create folder
    dir = basePath + "/ApdSongs";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
  startDownloading();
});

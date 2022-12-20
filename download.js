const itunesAPI = require("node-itunes-search");
const NodeID3 = require("node-id3");
const ProgressBar = require("progress");
const axios = require("axios");
const fs = require("fs");




module.exports = download = async (song, url, song_name, artist_names, query_artwork) => {
    console.log ("download info:");
    console.log("SONG:", song, "ARTIST:", artist_names, "URL:", url);

    try {
      let numb = global.index + 1;
      console.log(`(${numb}/${global.total}) Starting download: ${song}`);
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
        artist_names = artist_names.replace(/\s{2,10}/g, "");
        console.log("DOWNLOADED!");
        const filepath = `${__dirname}/songs/${song}.mp3`;
        //Replace all connectives by a simple ','
        artist_names = artist_names.replace(" and ", ", ");
        artist_names = artist_names.replace(" et ", ", ");
        artist_names = artist_names.replace(" und ", ", ");
        //Search track informations using the Itunes library
        const searchOptions = new itunesAPI.ItunesSearchOptions({
          term: query_artwork, // All searches require a single string query.
          limit: 1, // An optional maximum number of returned results may be specified.
        });
        //Use the result to extract tags
        itunesAPI.searchItunes(searchOptions).then((result) => {
          try {
            // Get all the tags and cover art of the track using node-itunes-search and write them with node-id3
            let maxres = result.results[0]["artworkUrl100"].replace(
              "100x100",
              "3000x3000"
            );
            let year = result.results[0]["releaseDate"].substring(0, 4);
            let genre = result.results[0]["primaryGenreName"].replace(
              /\?|<|>|\*|"|:|\||\/|\\/g,
              ""
            );
            let trackNumber = result.results[0]["trackNumber"];
            let trackCount = result.results[0]["trackCount"];
            trackNumber = trackNumber + "/" + trackCount;
            let album = result.results[0]["collectionName"].replace(
              /\?|<|>|\*|"|:|\||\/|\\/g,
              ""
            );
            //console.log(genre);
            //console.log(year);
            //console.log(trackNumber);
            //console.log(album);
            //console.log(maxres);
            let query_artwork_file = song + ".jpg";
            download_artwork(maxres, query_artwork_file, function () {
              //console.log('Artwork downloaded');
              const tags = {
                TALB: album,
                title: song_name,
                artist: artist_names,
                APIC: query_artwork_file,
                year: year,
                trackNumber: trackNumber,
                genre: genre,
              };
              //console.log(tags);
              const success = NodeID3.write(tags, filepath);
              console.log("WRITTEN TAGS");
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
              artist: artist_names,
            };
            //console.log(tags);
            const success = NodeID3.write(tags, filepath);
            console.log("WRITTEN TAGS (Only artist name and track title)");
            startDownloading();
          }
        });
      });
  
      //for saving in file...
      data.pipe(fs.createWriteStream(`${__dirname}/songs/${song}.mp3`));
    } catch (err) {
      console.log("Error:", err);
      startDownloading(); //for next song!
    }
  };
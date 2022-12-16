const urlDetect = require("./urlDetect");
const htmlEntities = require("html-entities");


module.exports = function findSongs (soup, playlistUser, playlistName) {
    let songs = [];
    //console.log(soup);
    if ( urlDetect() === "playlist") {
         // playlist
         const tracksInfo = soup.findAll("div", "songs-list-row"); //finding all songs info
         //console.log("tracksInfo", tracksInfo)
        for (let track of tracksInfo) {
            let songName = track.find("div", "songs-list__col--song").text;
            console.log(songName);
            let singerNames = track.find("div", "songs-list__col--secondary").text;
            let album = track.find("div", "songs-list__col--tertiary").text;
            singerNames = singerNames.replace(/\s{2,10}/g, ""); //remove spaces
            songName = songName.replace(/\?|<|>|\*|"|:|\||\/|\\/g, ""); //removing special characters which are not allowed in file name
            songs.push({
                name: htmlEntities.decode(songName),
                singer: htmlEntities.decode(singerNames),
                album: htmlEntities.decode(album),
            });
        }
    } else if ( urlDetect() === "album") {
        //Album
        const tracksInfo = soup.findAll("div", "songs-list-row--album"); //finding all songs info
        //console.log(tracksInfo);
        for (let track of tracksInfo) {
            let songName = track.find("div", "songs-list-row__song-name").text;
            console.log(songName);
            let singerNames = playlistUser; //grab the artist and name from the page headers
            let album = playlistName;
            singerNames = singerNames.replace(/\s{2,10}/g, ""); //remove spaces
            songName = songName.replace(/\?|<|>|\*|"|:|\||\/|\\/g, ""); //removing special characters which are not allowed in file name
            songs.push({
                name: htmlEntities.decode(songName),
                singer: htmlEntities.decode(singerNames),
                album: htmlEntities.decode(album),
            });
        }
    } else {
        console.log("error detecting playlist type from URL")
    }
    
    return songs;
}
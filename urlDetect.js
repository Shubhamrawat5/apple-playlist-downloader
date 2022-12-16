module.exports = function urlDetect (returnVal, url) {
// change the line to your URL
    const appleMusicURL = "https://music.apple.com/fi/playlist/a-tribe-called-quest-essentials/pl.75c7de95980a4e0c8129cd783f8d5f13";  //url Here
    let whatTypeOfURL = "error"
    if (appleMusicURL.indexOf("playlist") !== -1) {
        whatTypeOfURL = "playlist"
    } else  if (appleMusicURL.indexOf("album") !== -1)  {
        whatTypeOfURL = "album"
    }

    if (returnVal == "url") {
        return appleMusicURL
        
    } else if ( returnVal = "type") {
        console.log(`${whatTypeOfURL} detected.`)
        return whatTypeOfURL
    }
    
}

//https://music.apple.com/fi/album/the-low-end-theory/278911460
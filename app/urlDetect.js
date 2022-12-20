// checks the URL to see if it is a playlist or album, and returns it.
module.exports = function urlDetect (returnVal) {
    let whatTypeOfURL = "error"
    if (global.url.indexOf("playlist") !== -1) {
        whatTypeOfURL = "playlist"
    } else  if (global.url.indexOf("album") !== -1)  {
        whatTypeOfURL = "album"
    }
    console.log(`${whatTypeOfURL} detected.`)
    return whatTypeOfURL
}

//https://music.apple.com/fi/album/the-low-end-theory/278911460
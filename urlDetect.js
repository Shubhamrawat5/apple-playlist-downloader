module.exports = function urlDetect (returnVal) {
// change the line to your URL
    let appleMusicURL = global.url  //url Here

    let whatTypeOfURL = "error"
    if (appleMusicURL.indexOf("playlist") !== -1) {
        whatTypeOfURL = "playlist"
    } else  if (appleMusicURL.indexOf("album") !== -1)  {
        whatTypeOfURL = "album"
    }
    console.log(`${whatTypeOfURL} detected.`)
    return whatTypeOfURL
}

//https://music.apple.com/fi/album/the-low-end-theory/278911460
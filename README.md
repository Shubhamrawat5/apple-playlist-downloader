## apple-playlist-downloader 🎵

This is a fork of https://github.com/Shubhamrawat5/apple-playlist-downloader.git

Since the original repo doesn't really explain what's happening: This is a node js script that scrapes an Apple Music webpage and then assembles a list of the songs and uses a 3rd party site to grab the best match it can find of said song. 

This mostly works. It's a bit of a grab bag, most songs are 320 kbps, but the accuracy is not excellent as it'll often find an incorrect version of said song.

This version adds a command prompt and the ability to use Albums (not just user or Apple playlists). It's also been refractored for anyone else to tinker.

## Initial setup
1. Open cmd/console
2. Clone repo by `git clone https://github.com/fuzzywalrus/apple-playlist-downloader.git`
3. Open the directory by `cd apple-playlist-downloader`
4. Run `npm install` to install all dependencies
5. Run `node start.js`
6. Enter the URL to an Apple Music playlist or album to start downloading.

---

Note: after initial setup, just run `node start.js` for all future downloads

---

## Additional info:

Because of the quality of the search on sliderkz, this is a bit of a grab bag. Perhaps it can be queried more accurately, but I tried searching for songs with the artist + album title + track name + year and various combinations to no avail. 

This does not back from Apple's servers or require an Apple Music subscription. There isn't going to be any real way to nab Apple's copies via the web, even with an Apple Music account, as just a quick glance reveals Apple serves its music as AAC embedded in mp4, which are copy protected and the key is only sent after the requests are made to decrypt the media file.

## Dev info

I've refactored this to be to be less of a mess. It's not ideal by any stretch. For a quick explainer of what's happening:

User inputs a URL, Axios (headless browser) goes to the page in question, and scrapes it for the playlist or album song list, and fires off a series of queries to another site sliderkz, to complete the download, then attempts to match the song back with the ID3 information from an Apple Music ID3. 


I've broken apart the file structure to be easier to read and follow as the original program almost entirely depended on one massive JS file. A quick breakdown:

- start.js - Uses a command prompt wrapper to get a URL from the user
- app.js - goes to `getPlaylist()` to fire up Axios and then uses JSsoup to mess with the DOM data that's been returned.
- appleMusicPageLogic - Really should rename this to playlist, this attempts to puzzle out the playlist before passing it to `findSongs()`
- findSongs - This is a simple script to determine if the URL is an album or playlist, by way of `urlDetect()` and then make the correct scraping from the glob of data that Axios nabbed.
- urlDetect - A simple script that checks the URL for the correct strings so that `findsongs()` will work properly.
- GetURL.s - This is where the query is defined for a single song.
- download.js - This is where the bulk of the logic happens, once a song has been identified


### Screenshots 🚀

<img src = "https://i.ibb.co/jGkBFN6/aaaa.png" width="500"/>
<img width="831" alt="Capture d’écran 2021-09-26 à 19 16 32" src="https://user-images.githubusercontent.com/44288655/134817487-1a468b63-1e53-4f87-a862-05098813e52b.png">

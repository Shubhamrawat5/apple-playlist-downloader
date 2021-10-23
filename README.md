## apple-playlist-downloader 🎵

1. Open cmd/console
2. Clone repo by `git clone git@github.com:Shubhamrawat5/apple-playlist-downloader.git`
3. Open directory by `cd apple-playlist-downloader`
4. Run `npm install` and `pip3 install -r requirements.txt` to install all dependencies
5. If you get a message that there is many security problems type `npm audit fix --force` 
6. Make sure the python command is right in app.js line 2, default command is 'python3'.
7. Now edit playlist url variable and set your playlist link in file `apple_playlist.js [line 8]`
8. Run `node app.js` or if you don't want lyrics add a '-p' to the command

- Now a folder named "songs" will be created.

- Playlist info will be extract and all the matching songs will start donwloading!

- If by chance you stop the script in between, then no worries as if song is already downloaded then next time it won't be downloaded again!

- Also there is 5% chance that song's some remix or different same name song will get downloaded...

- It tries to download time-synced lyrics (.lrc file) and song metadata (Cover image, artist, album, date, genre, etc...)

### Screenshots 🚀

<img src = "https://i.ibb.co/jGkBFN6/aaaa.png" width="500"/>
<img width="588" alt="Capture d’écran 2021-10-21 à 18 57 46" src="https://user-images.githubusercontent.com/44288655/138323432-b65f9454-ad11-4a0f-be08-4c6021ae9192.png">
<img width="351" alt="Capture d’écran 2021-10-21 à 18 57 54" src="https://user-images.githubusercontent.com/44288655/138323447-54e455f2-c7d6-4f4c-b6f8-357eadc9b7e7.png"><img width="104" alt="Capture d’écran 2021-10-21 à 18 59 41" src="https://user-images.githubusercontent.com/44288655/138323663-273786da-b16d-485b-9cbf-94836baa53f2.png">


### Contribute & Issues 🚀

- Feel free to help to improve this tool.
- Inform if you face any problem.

// const fs = require("fs");
// var ProgressBar = require("progress");
// const axios = require("axios");

// const INFO_URL = "https://slider.kz/vk_auth.php?q=";
// const DOWNLOAD_URL = "https://slider.kz/download/";

// const download = async (song, url) => {
//   try {
//     let numb = 1;
//     console.log(`Starting download: ${song}`);
//     console.log(url);
//     url = url.replace(/,/g, "");
//     console.log(url);
//     const { data, headers } = await axios({
//       method: "GET",
//       url: url,
//       responseType: "stream",
//     });

//     //for progress bar...
//     const totalLength = headers["content-length"];
//     const progressBar = new ProgressBar(
//       "-> downloading [:bar] :percent :etas",
//       {
//         width: 40,
//         complete: "=",
//         incomplete: " ",
//         renderThrottle: 1,
//         total: parseInt(totalLength),
//       }
//     );

//     data.on("data", (chunk) => progressBar.tick(chunk.length));
//     data.on("end", () => {
//       console.log("DOWNLOADED!");
//       startDownloading(); //for next song!
//     });

//     //for saving in file...
//     data.pipe(fs.createWriteStream(`${__dirname}/songs/${song}.mp3`));
//   } catch (e) {
//     console.log("some error came!", e);
//   }
// };

// const getURL = async (song, singer) => {
//   let query = (song + "%20" + singer).replace(/\s/g, "%20");
//   console.log(INFO_URL + query);
//   const { data } = await axios.get(encodeURI(INFO_URL + query));

//   //   console.log(data);

//   if (data["audios"][""].length <= 1) {
//     //no result
//     console.log("==[ SONG NOT FOUND! ]== : " + song);
//     notFound.push(song + " - " + singer);
//     startDownloading();
//     return;
//   }

//   //avoid remix,revisited,mix
//   let i = 0;
//   let track = data["audios"][""][i];
//   while (/remix|revisited|mix/i.test(track.tit_art)) {
//     i += 1;
//     track = data["audios"][""][i];
//   }
//   //if reach the end then select the first song
//   if (!track) {
//     track = data["audios"][""][0];
//   }

//   console.log(track);

//   let link = DOWNLOAD_URL + track.id + "/";
//   link = link + track.duration + "/";
//   link = link + track.url + "/";
//   link = link + track.tit_art + ".mp3" + "?extra=";
//   link = link + track.extra;
//   link = encodeURI(link); //to replace unescaped characters from link

//   let songName = track.tit_art;
//   songName.replace(/\?|<|>|\*|"|:|\||\/|\\/g, ""); //removing special characters which are not allowed in file name
//   download(songName, link);
// };

// getURL("Кто я без тебя?", "Bahh Tee, Turken");

// // https://slider.kz/download/-2001595053_94595053/179/cs3-5v4/p2/0c4a923a13e792/Bahh%20Tee%20Turken%20-%20Кто%20я%20без%20тебя?.mp3?extra=P-UsDbiPYWd6ElugnLEQ80oOsbcDYThLihfYLch4Ykqe9l_gzDZxktIvjc7B4k8QnjctXE1zps4TajmZP_Kyi_ygNO4vq2Kl1emR2myVy-NV9GUac8E56uLt9cb_Zj-SyFIEO3LiU5_JagSCydkKme4q&long_chunk=1

// // https://slider.kz/download/-2001595053_94595053/179/cs3-5v4/p2/0c4a923a13e792/Bahh%20Tee%2C%20Turken%20-%20%D0%9A%D1%82%D0%BE%20%D1%8F%20%D0%B1%D0%B5%D0%B7%20%D1%82%D0%B5%D0%B1%D1%8F%3F.mp3?extra=P-UsDbiPYWd6ElugnLEQ80oOsbcDYThLihfYLch4Ykqe9l_gzDZxktIvjc7B4k8QnjctXE1zocwaYT6dOvC4i_ygNO4vq2Kl1emR2myVy-NV9GUac8E56uLt9cb_Zj-SyFIEO3LiBJ2eMVmEytkJz-t_&long_chunk=1

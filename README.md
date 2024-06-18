How to use

Install all the library in the require section

```batch
npm install axios
npm install ytdl-core
npm install fluent-ffmpeg
npm install speaker
npm install youtube-scrapper
```

Create a new file, you can name it anything like for example Index.js
```javascript
const youtube = require("./youtube");

const AudioPlayer = new youtube.AudioPlayer();

(async () =>
      //We need to use await or else it will crash
      await AudioPlayer.stream("MUSIC NAME HERE"); //Method 1
      await AudioPlayer.playDownload("MUSIC NAME HERE"); //Method 2
})();
```
